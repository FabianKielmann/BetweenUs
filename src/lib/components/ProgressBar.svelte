<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	const { current, total }: Props = $props();
	const percentage = $derived(total > 0 ? (current / total) * 100 : 0);
</script>

<div class="space-y-2">
	<div class="flex justify-between text-sm text-gray-600">
		<span>{current} von {total} beantwortet</span>
		<span>{Math.round(percentage)}%</span>
	</div>
	<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
		<div
			class="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
</div>
