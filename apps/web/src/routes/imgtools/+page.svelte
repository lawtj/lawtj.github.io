<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";

	import { PUBLIC_API_BASE_URL } from "$env/static/public";

	let currentFile: File | null = null;
	let currentImageUrl: string | null = null;
	let currentBlob: Blob | null = null;
	let imageDimensions: { width: number; height: number } | null = null;
	let fileSize: number = 0;
	let fileName: string = '';

	let resizeSize = 400;
	let resizeQuality = 80;
	let resizeLoading = false;

	let tolerance = 10;
	let transparentQuality = 80;
	let transparentLoading = false;

	let webpQuality = 80;
	let webpLoading = false;

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		currentFile = file;
		fileName = file.name;
		fileSize = file.size;
		
		const imageUrl = URL.createObjectURL(file);
		currentImageUrl = imageUrl;
		currentBlob = file;
		
		const img = new Image();
		img.onload = () => {
			imageDimensions = { width: img.width, height: img.height };
		};
		img.src = imageUrl;
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function updateImagePreview(blob: Blob) {
		if (currentImageUrl) {
			URL.revokeObjectURL(currentImageUrl);
		}
		currentImageUrl = URL.createObjectURL(blob);
		currentBlob = blob;
		fileSize = blob.size;
		
		const img = new Image();
		img.onload = () => {
			imageDimensions = { width: img.width, height: img.height };
		};
		img.src = currentImageUrl;
	}

	function downloadCurrentImage() {
		if (!currentBlob) return;
		
		const url = URL.createObjectURL(currentBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName.replace(/\.[^/.]+$/, '') + '_processed.webp';
		a.click();
		URL.revokeObjectURL(url);
	}


	async function handleResize() {
		if (!currentBlob) return;
		
		resizeLoading = true;
		const formData = new FormData();
		formData.append('file', currentBlob, fileName);
		formData.append('size', resizeSize.toString());
		formData.append('quality', resizeQuality.toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/resize`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				updateImagePreview(blob);
			}
		} catch (error) {
			console.error('Error resizing image:', error);
		} finally {
			resizeLoading = false;
		}
	}

	async function handleTransparent() {
		if (!currentBlob) return;
		
		transparentLoading = true;
		const formData = new FormData();
		formData.append('file', currentBlob, fileName);
		formData.append('tolerance', tolerance.toString());
		formData.append('quality', transparentQuality.toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/make-transparent`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				updateImagePreview(blob);
			}
		} catch (error) {
			console.error('Error making image transparent:', error);
		} finally {
			transparentLoading = false;
		}
	}

	async function handleWebpConvert() {
		if (!currentBlob) return;
		
		webpLoading = true;
		const formData = new FormData();
		formData.append('file', currentBlob, fileName);
		formData.append('quality', webpQuality.toString());
		
		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/imgtools/convert-to-webp`, {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const blob = await response.blob();
				updateImagePreview(blob);
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

	<!-- File Upload Section -->
	<Card.Root class="mb-6">
		<Card.Header>
			<Card.Title>Upload Image</Card.Title>
			<Card.Description>Select an image to process</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="max-w-md mx-auto space-y-2">
				<Label for="file-upload">Select Image File</Label>
				<Input
					id="file-upload"
					type="file"
					accept="image/*"
					onchange={handleFileUpload}
				/>
			</div>
			
			{#if currentImageUrl}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Preview</Label>
						<div class="border rounded-lg p-2 bg-gray-50">
							<img 
								src={currentImageUrl} 
								alt="Current image" 
								class="max-w-full h-auto max-h-64 mx-auto rounded"
							/>
						</div>
					</div>
					<div class="space-y-2">
						<Label>Image Info</Label>
						<div class="text-sm space-y-1">
							<p><strong>Filename:</strong> {fileName}</p>
							{#if imageDimensions}
								<p><strong>Dimensions:</strong> {imageDimensions.width} × {imageDimensions.height} px</p>
							{/if}
							<p><strong>File Size:</strong> {formatFileSize(fileSize)}</p>
						</div>
						<Button 
							onclick={downloadCurrentImage}
							disabled={!currentBlob}
							class="w-full mt-4"
						>
							Download Image
						</Button>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<div class="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
		<!-- Resize Image -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Resize Image</Card.Title>
				<Card.Description>Resize an image to a specific width/height</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class='space-y-2'>
					<Label for="resize-size">Target Size (longer dimension): {resizeSize}px</Label>
					<div class="space-y-3">
						<div class="flex flex-wrap gap-2">
							<Button
								type="button"
								variant={resizeSize === 400 ? "default" : "outline"}
								size="sm"
								onclick={() => resizeSize = 400}
							>400px</Button>
							<Button
								type="button"
								variant={resizeSize === 800 ? "default" : "outline"}
								size="sm"
								onclick={() => resizeSize = 800}
							>800px</Button>
							<Button
								type="button"
								variant={resizeSize === 1024 ? "default" : "outline"}
								size="sm"
								onclick={() => resizeSize = 1024}
							>1024px</Button>
							<Button
								type="button"
								variant={resizeSize === 1920 ? "default" : "outline"}
								size="sm"
								onclick={() => resizeSize = 1920}
							>1920px</Button>
						</div>
						<Input
							type="number"
							bind:value={resizeSize}
							min="50"
							max="4000"
							step="1"
							class="w-full"
							placeholder="Custom size in pixels"
						/>
					</div>
				</div>
				<div>
					<Label for="resize-quality">Quality: {resizeQuality}%</Label>
					<Slider
						type="single"
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
					disabled={!currentBlob || resizeLoading}
					class="w-full"
				>
					{resizeLoading ? 'Processing...' : 'Resize Image'}
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
					<Label for="tolerance">Tolerance: {tolerance}</Label>
					<Slider
						type="single"
						bind:value={tolerance}
						min={1}
						max={50}
						step={1}
						class="mt-2"
					/>
				</div>
				<div>
					<Label for="transparent-quality">Quality: {transparentQuality}%</Label>
					<Slider
						type="single"
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
					disabled={!currentBlob || transparentLoading}
					class="w-full"
				>
					{transparentLoading ? 'Processing...' : 'Make Transparent'}
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
					<Label for="webp-quality">Quality: {webpQuality}%</Label>
					<Slider
						type="single"
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
					disabled={!currentBlob || webpLoading}
					class="w-full"
				>
					{webpLoading ? 'Processing...' : 'Convert to WebP'}
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>