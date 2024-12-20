<script lang="ts">
    let { title, description, link } = $props();
</script>

<div class="card bg-base-100 w-96 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{title}</h2>
      <p>{description}</p>
      <div class="card-actions justify-center">
        <a href={link} class="btn btn-primary">Go to {title}</a>
      </div>
    </div>
  </div>