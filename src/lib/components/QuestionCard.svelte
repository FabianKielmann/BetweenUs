<script lang="ts">
	import type { Question, ResponseType } from '$lib/types';

	interface Props {
		question: Question;
		currentAnswer?: ResponseType;
		onAnswer: (response: ResponseType) => void;
	}

	const { question, currentAnswer, onAnswer }: Props = $props();
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
	<div class="mb-6">
		<span class="text-sm font-medium text-purple-600 uppercase tracking-wide">
			{question.category}
		</span>
		<h2 class="text-2xl font-semibold mt-2 text-gray-800">
			{question.text}
		</h2>
	</div>

	<div class="grid grid-cols-3 gap-4">
		<button
			onclick={() => onAnswer('yes')}
			class="py-4 px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'yes'
				? 'bg-green-500 text-white shadow-lg scale-105'
				: 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'}"
		>
			Yes
		</button>
		<button
			onclick={() => onAnswer('maybe')}
			class="py-4 px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'maybe'
				? 'bg-yellow-500 text-white shadow-lg scale-105'
				: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:shadow-md'}"
		>
			Maybe
		</button>
		<button
			onclick={() => onAnswer('no')}
			class="py-4 px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'no'
				? 'bg-red-500 text-white shadow-lg scale-105'
				: 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md'}"
		>
			No
		</button>
	</div>
</div>
