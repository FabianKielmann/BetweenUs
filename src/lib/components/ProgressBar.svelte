<script lang="ts">
	interface Props {
		current: number;
		total: number;
		questionNumber: number;
	}

	const { current, total, questionNumber }: Props = $props();
	const percentage = $derived((current / total) * 100);
</script>

<div class="space-y-2">
	<div class="flex justify-between text-sm text-gray-600">
		<span>Question {questionNumber} of {total}</span>
		<span>{current} answered • {Math.round(percentage)}%</span>
	</div>
	<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
		<div
			class="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
</div>
