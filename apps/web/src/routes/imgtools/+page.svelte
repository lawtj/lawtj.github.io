<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import { PUBLIC_API_BASE_URL } from "$env/static/public";

	let resizeFile: File | null = null;
	let resizeSize = [400];
	let resizeQuality = [80];
	let resizeLoading = false;

	let transparentFile: File | null = null;
	let tolerance = [10];
	let transparentQuality = [80];
	let transparentLoading = false;

	let webpFile: File | null = null;
	let webpQuality = [80];
	let webpLoading = false;


	async function handleResize() {
		if (!resizeFile) return;
		
		resizeLoading = true;
		const formData = new FormData();
		formData.append('file', resizeFile);
		formData.append('size', resizeSize[0].toString());
		formData.append('quality', resizeQuality[0].toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/resize`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'resized_image.webp';
				a.click();
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error resizing image:', error);
		} finally {
			resizeLoading = false;
		}
	}

	async function handleTransparent() {
		if (!transparentFile) return;
		
		transparentLoading = true;
		const formData = new FormData();
		formData.append('file', transparentFile);
		formData.append('tolerance', tolerance[0].toString());
		formData.append('quality', transparentQuality[0].toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/make-transparent`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'transparent_image.webp';
				a.click();
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error making image transparent:', error);
		} finally {
			transparentLoading = false;
		}
	}

	async function handleWebpConvert() {
		if (!webpFile) return;
		
		webpLoading = true;
		const formData = new FormData();
		formData.append('file', webpFile);
		formData.append('quality', webpQuality[0].toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/convert-to-webp`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'converted_image.webp';
				a.click();
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error converting image:', error);
		} finally {
			webpLoading = false;
		}
	}
</script>

<div class="container mx-auto py-8 px-4">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-4">Image Tools</h1>
		<p class="text-muted-foreground">Resize, make transparent, and convert images to WebP format</p>
	</div>

	<div class="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
		<!-- Resize Image -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Resize Image</Card.Title>
				<Card.Description>Resize an image to a specific width/height</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<Label for="resize-file">Select Image</Label>
					<Input
						id="resize-file"
						type="file"
						accept="image/*"
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							resizeFile = target.files?.[0] || null;
						}}
					/>
				</div>
				<div>
					<Label for="resize-size">Size: {resizeSize[0]}px</Label>
					<Slider
						bind:value={resizeSize}
						min={50}
						max={2000}
						step={50}
						class="mt-2"
					/>
				</div>
				<div>
					<Label for="resize-quality">Quality: {resizeQuality[0]}%</Label>
					<Slider
						bind:value={resizeQuality}
						min={10}
						max={100}
						step={10}
						class="mt-2"
					/>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button 
					onclick={handleResize} 
					disabled={!resizeFile || resizeLoading}
					class="w-full"
				>
					{resizeLoading ? 'Processing...' : 'Resize & Download'}
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Make Transparent -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Make Transparent</Card.Title>
				<Card.Description>Remove background from an image</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<Label for="transparent-file">Select Image</Label>
					<Input
						id="transparent-file"
						type="file"
						accept="image/*"
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							transparentFile = target.files?.[0] || null;
						}}
					/>
				</div>
				<div>
					<Label for="tolerance">Tolerance: {tolerance[0]}</Label>
					<Slider
						bind:value={tolerance}
						min={1}
						max={50}
						step={1}
						class="mt-2"
					/>
				</div>
				<div>
					<Label for="transparent-quality">Quality: {transparentQuality[0]}%</Label>
					<Slider
						bind:value={transparentQuality}
						min={10}
						max={100}
						step={10}
						class="mt-2"
					/>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button 
					onclick={handleTransparent} 
					disabled={!transparentFile || transparentLoading}
					class="w-full"
				>
					{transparentLoading ? 'Processing...' : 'Make Transparent & Download'}
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Convert to WebP -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Convert to WebP</Card.Title>
				<Card.Description>Convert any image format to WebP</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<Label for="webp-file">Select Image</Label>
					<Input
						id="webp-file"
						type="file"
						accept="image/*"
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							webpFile = target.files?.[0] || null;
						}}
					/>
				</div>
				<div>
					<Label for="webp-quality">Quality: {webpQuality[0]}%</Label>
					<Slider
						bind:value={webpQuality}
						min={10}
						max={100}
						step={10}
						class="mt-2"
					/>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button 
					onclick={handleWebpConvert} 
					disabled={!webpFile || webpLoading}
					class="w-full"
				>
					{webpLoading ? 'Processing...' : 'Convert & Download'}
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>