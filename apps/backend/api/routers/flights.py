from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import logging
from typing import Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class SerpApiFlightRequest(BaseModel):
    api_key: str
    origin: str
    destination: str
    departure_date: str
    return_date: str
    adults: str
    non_stop: Optional[bool] = False

@router.post("/serpapi-proxy")
async def proxy_serpapi_flights(request: SerpApiFlightRequest):
    """
    Proxy SerpAPI flight search requests to bypass CORS.
    Handles the two-step process: outbound flights, then return flights for each departure_token.
    """
    try:
        logger.info(f"Starting SerpAPI search: {request.origin} -> {request.destination}, {request.departure_date} to {request.return_date}")
        
        # Step 1: Get outbound flights
        outbound_params = {
            'api_key': request.api_key,
            'engine': 'google_flights',
            'hl': 'en',
            'gl': 'us',
            'departure_id': request.origin,
            'arrival_id': request.destination,
            'outbound_date': request.departure_date,
            'currency': 'USD',
            'adults': request.adults,
            'type': '2'  # One way for outbound
        }
        
        if request.non_stop:
            outbound_params['stops'] = '1'  # 1 = Nonstop only
            
        logger.info(f"Outbound search params: {outbound_params}")

        async with httpx.AsyncClient() as client:
            # Get outbound flights
            logger.info("Making outbound flights request to SerpAPI...")
            outbound_response = await client.get(
                'https://serpapi.com/search.json',
                params=outbound_params,
                timeout=30.0
            )
            
            logger.info(f"Outbound response status: {outbound_response.status_code}")

            logger.info(f"Outbound response: {outbound_response.text}")
            
            if outbound_response.status_code != 200:
                logger.error(f"Outbound request failed: {outbound_response.text}")
                raise HTTPException(
                    status_code=outbound_response.status_code,
                    detail=f"SerpAPI outbound request failed: {outbound_response.text}"
                )
            
            outbound_data = outbound_response.json()
            logger.info(f"Outbound response keys: {list(outbound_data.keys())}")
            
            # Check for errors in response
            if 'error' in outbound_data:
                logger.error(f"SerpAPI error in outbound response: {outbound_data['error']}")
                raise HTTPException(status_code=400, detail=f"SerpAPI error: {outbound_data['error']}")
            
            # Get all outbound flights and their departure tokens
            outbound_flights = []
            best_flights = outbound_data.get('best_flights', [])
            other_flights = outbound_data.get('other_flights', [])
            
            logger.info(f"Found {len(best_flights)} best flights, {len(other_flights)} other flights")
            
            outbound_flights.extend(best_flights)
            outbound_flights.extend(other_flights)
            
            if not outbound_flights:
                logger.warning("No outbound flights found")
                return {"data": []}  # No outbound flights found
                
            logger.info(f"Total outbound flights: {len(outbound_flights)}")
            
            # Step 2: For each outbound flight, get return flights
            all_combinations = []
            
            for i, outbound_flight in enumerate(outbound_flights):
                departure_token = outbound_flight.get('departure_token')
                logger.info(f"Processing outbound flight {i+1}/{len(outbound_flights)}")
                
                # Debug: log the keys of the outbound flight object
                if i == 0:  # Only log first flight structure to avoid spam
                    logger.info(f"First outbound flight keys: {list(outbound_flight.keys())}")
                    if 'price' in outbound_flight:
                        logger.info(f"First outbound flight price: {outbound_flight['price']}")
                
                if not departure_token:
                    logger.warning(f"Outbound flight {i+1} has no departure_token, skipping")
                    logger.warning(f"Available keys: {list(outbound_flight.keys())}")
                    continue
                    
                logger.info(f"Getting return flights for departure_token: {departure_token[:20]}...")
                    
                # Get return flights for this outbound flight
                return_params = {
                    'api_key': request.api_key,
                    'engine': 'google_flights',
                    'hl': 'en',
                    'gl': 'us',
                    'departure_token': departure_token,
                    'currency': 'USD'
                }
                
                try:
                    return_response = await client.get(
                        'https://serpapi.com/search.json',
                        params=return_params,
                        timeout=30.0
                    )
                    
                    logger.info(f"Return flights response status: {return_response.status_code}")
                    
                    if return_response.status_code == 200:
                        return_data = return_response.json()
                        logger.info(f"Return response keys: {list(return_data.keys())}")
                        
                        # Check for errors in return response
                        if 'error' in return_data:
                            logger.error(f"SerpAPI error in return response: {return_data['error']}")
                            continue
                        
                        # Get all return flights
                        return_flights = []
                        best_return = return_data.get('best_flights', [])
                        other_return = return_data.get('other_flights', [])
                        
                        logger.info(f"Found {len(best_return)} best return flights, {len(other_return)} other return flights")
                        
                        return_flights.extend(best_return)
                        return_flights.extend(other_return)
                        
                        # Create combinations of this outbound with each return
                        logger.info(f"Creating {len(return_flights)} combinations for outbound flight {i+1}")
                        for return_flight in return_flights:
                            # Transform to Amadeus format immediately
                            outbound_leg = outbound_flight.get('flights', [{}])[0]
                            return_leg = return_flight.get('flights', [{}])[0]
                            
                            amadeus_flight = {
                                "type": "flight-offer",
                                "id": f"{outbound_flight.get('departure_token', '')}-{return_flight.get('departure_token', '')}",
                                "price": {
                                    "currency": "USD",
                                    "total": str(outbound_flight.get('price', 0) + return_flight.get('price', 0)),
                                    "grandTotal": str(outbound_flight.get('price', 0) + return_flight.get('price', 0))
                                },
                                "itineraries": [
                                    # Outbound itinerary
                                    {
                                        "duration": f"PT{outbound_leg.get('duration', 0) // 60}H{outbound_leg.get('duration', 0) % 60}M",
                                        "segments": [{
                                            "departure": {
                                                "iataCode": outbound_leg.get('departure_airport', {}).get('id', request.origin),
                                                "at": outbound_leg.get('departure_airport', {}).get('time', '')
                                            },
                                            "arrival": {
                                                "iataCode": outbound_leg.get('arrival_airport', {}).get('id', request.destination),
                                                "at": outbound_leg.get('arrival_airport', {}).get('time', '')
                                            },
                                            "carrierCode": outbound_leg.get('flight_number', ' ').split(' ')[0],
                                            "number": outbound_leg.get('flight_number', ' ').split(' ')[1] if len(outbound_leg.get('flight_number', ' ').split(' ')) > 1 else '0000'
                                        }]
                                    },
                                    # Return itinerary
                                    {
                                        "duration": f"PT{return_leg.get('duration', 0) // 60}H{return_leg.get('duration', 0) % 60}M",
                                        "segments": [{
                                            "departure": {
                                                "iataCode": return_leg.get('departure_airport', {}).get('id', request.destination),
                                                "at": return_leg.get('departure_airport', {}).get('time', '')
                                            },
                                            "arrival": {
                                                "iataCode": return_leg.get('arrival_airport', {}).get('id', request.origin),
                                                "at": return_leg.get('arrival_airport', {}).get('time', '')
                                            },
                                            "carrierCode": return_leg.get('flight_number', ' ').split(' ')[0],
                                            "number": return_leg.get('flight_number', ' ').split(' ')[1] if len(return_leg.get('flight_number', ' ').split(' ')) > 1 else '0000'
                                        }]
                                    }
                                ],
                                "_searchDep": request.departure_date,
                                "_searchRet": request.return_date
                            }
                            all_combinations.append(amadeus_flight)
                
                except Exception as e:
                    logger.error(f"Error fetching return flights for token {departure_token}: {e}")
                    continue
            
            logger.info(f"Final result: {len(all_combinations)} total flight combinations created")
            return {"data": all_combinations}  # Return in Amadeus format
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")