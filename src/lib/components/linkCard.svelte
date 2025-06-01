<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button";
    
    type Props = {
        title: string;
        description: string;
        link: string;
        subheader: string;
    };

    let { title, description, link, subheader }: Props = $props();
</script>

<Card.Root class="w-96 shadow-lg hover:shadow-xl transition-shadow duration-200 h-[300px] flex flex-col justify-between">
    <Card.Header>
        <Card.Title class="text-xl">{title}</Card.Title>
        <Card.Description class="text-muted-foreground">{subheader}</Card.Description>

    </Card.Header>
    <Card.Content>
        <p class="text-muted-foreground">{description}</p>
    </Card.Content>
    <Card.Footer class="flex justify-center">
        <Button href={link} class="w-full">
            Go to {title}
        </Button>
    </Card.Footer>
</Card.Root>