<script lang="ts">
	import type { Message } from './AppFrame'
	import type { Writable } from 'svelte/store'
	import SiteInfo from "./SiteInfo.svelte";
	import Time from "./Time.svelte";
	import { formatDateTime } from './format.ts'
	import { page } from'./store'
	export let title: string
	let { siteInfo } = page
	let messages:Writable<Message[]> = page.messages
	let name: string;
	$: name = $siteInfo.cert_user_id || 'Select User'
	let message = ''
	function selectUser(){
		page.selectUser()
		return false
	}
	function sendMessage(){
		page.sendMessage(message,sentMessage=>{
			if(message == sentMessage){
				message = ''
			}
		})
		return false
	}
	function onKey(event: KeyboardEvent){
		if(event.keyCode==13){
			sendMessage()
			return false
		}
	}
</script>

<h1>{title}</h1>
<SiteInfo/>
<p>
	#msg: {$messages.length}
</p>
<input type="button" on:click={selectUser} value={name}>
<input type="text" bind:value={message} on:keydown={onKey}>
<input type="button" value="Send" on:click={sendMessage}>
<ul>
{#each $messages as message}
	<li><span class="user">{message.cert_user_id}</span> <Time class="time" time={message.created_at}/> <span class="message">{message.content}</span></li>
{/each}
	<li>Welcome to ZeroChat!</li>
</ul>
<footer>
	<p>Visit the <a href="/todo">Git Center</a> to study the source code.</p>
	<p>Visit the <a href="/Blog.ZeroNetwork.bit/?Post:99:ZeroChat+tutorial+new">ZeroBlog</a> to learn how to build ZeroNet webapps.</p>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</footer>

<style>
	footer {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	@media (min-width: 640px) {
		footer {
			max-width: none;
		}
	}

	h1 {
		color: #ff3e00;
		/* text-transform: uppercase; */
		font-size: 2em;
		font-weight: 100;
	}

	ul {
		padding-left: 0.5em;
	}
	li {
		list-style: none;
	}
	.user {
		font-weight: bold;
		color: #5050ff;
	}
	:global(.time) {
		color: grey;
		font-size: 0.8em;
	}
	:global(.time:after) {
		content: ": "
	}
	@media (max-width: 640px) {
		.message {
			display: block;
			padding-top: 0.2em;
			margin-bottom: 0.75em;
		}
	}

</style>