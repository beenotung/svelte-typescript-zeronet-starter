<script lang="ts">
    export let time: number
    let date = new Date(time)
    let now = new Date()
</script>

{#if now.toLocaleDateString() == date.toLocaleDateString()}
<span class={$$props.class + " short"}>{date.toLocaleTimeString()}</span>
{:else}
<span class={$$props.class + " long"}>{date.toLocaleString()}</span>
{/if}

<style>
	@media (max-width: 640px) {
        .time.long {
            display: block;
        }
    }
</style>