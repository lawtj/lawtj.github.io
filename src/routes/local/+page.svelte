  <script lang="ts">
    type Drug = {
      toxicDose: number;
      givenDose: number | null;
      milligrams: number;
      name: string;
    };
  
    type Drugs = {
      [key: string]: Drug;
    };
  
    let kgs = $state(70);
    
    let drugs = $state<Drugs>({
      lidocaine1: {
        toxicDose: 4.5,
        givenDose: null,
        milligrams: 10,
        name: "Lidocaine 1%"
      },
      lidocaine2: {
        toxicDose: 4.5,
        givenDose: null,
        milligrams: 20,
        name: "Lidocaine 2%"
      },
      lidocaine2epi: {
        toxicDose: 7,
        givenDose: null,
        milligrams: 20,
        name: "Lidocaine 2% with epinephrine"
      },
      bupivacaine025: {
        toxicDose: 2.5,
        givenDose: null,
        milligrams: 2.5,
        name: "Bupivacaine 0.25%"
      },
      bupivacaine05: {
        toxicDose: 2.5,
        givenDose: null,
        milligrams: 5,
        name: "Bupivacaine 0.5%"
      },
      ropi05: {
        toxicDose: 3,
        givenDose: null,
        milligrams: 5,
        name: "Ropivacaine 0.5%"
      },
    });

  
    function getPercentage(drugName: string): number {
      const drug = drugs[drugName];
      return (drug.givenDose || 0) * drug.milligrams / (kgs * drug.toxicDose);
    }
  
    let percentOfTotal = $derived(
      Object.keys(drugs).reduce((total, drugName) => {
        return total + getPercentage(drugName);
      }, 0)
    );
  
    function mLremaining(drugName: string): number {
      const fracLeft = 1 - percentOfTotal;
      const totalDoseLeft = fracLeft * (drugs[drugName].toxicDose * kgs);
      return Math.round(totalDoseLeft / drugs[drugName].milligrams);
    }
  
    let textColor = $derived(
      percentOfTotal > 1 ? 'text-error' : 
      percentOfTotal > 0 ? 'text-success' : 
      'text-primary'
    );
  
    let statusText = $derived(
      !kgs ? 'Please enter the patient weight' :
      Number.isNaN(percentOfTotal) || percentOfTotal === 0 ? 'Please enter some anesthetic given' :
      percentOfTotal > 1 ? 'You have exceeded the toxic dose of local anesthetic' :
      `You have used ${Math.round(percentOfTotal * 100)}% of the toxic dose of local anesthetic`
    );
  
    let toxic_doses_modal: HTMLDialogElement;
  </script>

<!-- main div -->
<div class="flex flex-col items-center gap-2 p-4">

<div class="container mx-auto ">
  <header class="bg-base-200 p-4 rounded-lg ">
    <h1 class="text-2xl font-bold text-center">Local Anesthetic Remaining Calculator</h1>
  </header>
</div>

<div class="alert mt-4 w-full md:w-1/2 {textColor}">
    <span>{statusText}</span>
  </div>

<div class="flex flex-col md:flex-row gap-4">
  <div>
    <div class="form-control">
      <label class="label">
        <span class="label-text">Patient weight (kg)</span>
      </label>
      <input 
        type="number" 
        class="input input-bordered" 
        bind:value={kgs}
        placeholder="Enter weight in kg"
      />
    </div>

    <div class="mt-4">
      <h3 class="text-xl font-semibold text-center mb-4 bg-primary  text-primary-content p-4 rounded-lg">How much local can you give?</h3>
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Amount remaining (ml)</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(drugs) as [drugName, drug]}
              <tr>
                <td>{drug.name}</td>
                <td>{mLremaining(drugName)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <!-- Add modal trigger button -->
    
    <div class="card bg-base-200 p-4">
      <h3 class="text-xl font-semibold text-center mb-4">How much local have you given?</h3>
      <div class="flex justify-center">
        <button class="btn btn-primary btn-sm w-48" onclick={() => toxic_doses_modal.showModal()}>
          Show Toxic Doses
        </button>
      </div>
      {#each Object.entries(drugs) as [drugName, drug]}
        <div class="form-control">
          <label class="label">
            <span class="label-text">{drug.name}</span>
          </label>
          <input 
            type="number" 
            class="input input-bordered" 
            bind:value={drug.givenDose}
            placeholder="ml"
          />
        </div>
      {/each}
      
      
    </div>

    <!-- Replace collapse with modal -->
    <dialog bind:this={toxic_doses_modal} id="toxic_doses_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-center mb-4">Toxic Doses</h3>
        
        <div class="space-y-4">
          {#each Object.entries(drugs) as [drugName, drug]}
            <div class="form-control">
              <label class="label">
                <span class="label-text">{drug.name}</span>
              </label>
              <div class="input-group">
                <input 
                  type="number" 
                  class="input input-bordered w-full" 
                  bind:value={drug.toxicDose}
                />
                <span>mg/kg</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
      
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

  </div>
</div>



</div>