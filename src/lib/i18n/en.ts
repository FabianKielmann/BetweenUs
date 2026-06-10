const en = {
	layout: {
		footer: 'Made with privacy in mind. Your answers are stored locally only.'
	},
	home: {
		title: 'Discover Together',
		subtitle: 'A private way for couples to explore their intimacy preferences',
		howItWorks: 'How it works',
		step1Title: 'Answer Questions',
		step1Desc: 'Privately answer questions about your preferences and desires',
		step2Title: 'Share Your Code',
		step2Desc: 'Get a unique code to share with your partner',
		step3Title: 'Discover Matches',
		step3Desc: 'See only what you both said "yes" to - no awkward moments!',
		startNew: 'Start New Session',
		joinPartner: 'Join Partner',
		privacy: '100% private - answers stored only on your device',
		noAccounts: 'No accounts. No database. No tracking.'
	},
	join: {
		title: 'Join Your Partner',
		subtitle: 'Enter the code your partner shared with you',
		codeLabel: "Partner's Code",
		codePlaceholder: 'Enter code here...',
		submit: 'Continue to Questions',
		backHome: 'Back to home',
		whatNextTitle: 'What happens next?',
		whatNextItem1: "You'll answer the same questions",
		whatNextItem2: "You'll get YOUR own code to share back",
		whatNextItem3: "Once you both exchange codes, you'll see mutual matches",
		whatNextPrivacy: 'This two-way exchange ensures complete privacy!',
		errorEmpty: 'Please enter a code',
		errorInvalid: 'Invalid code. Please check and try again.'
	},
	questionnaire: {
		answered: '{current} of {total} answered',
		backButton: '← Back',
		doneTitle: 'All Done!',
		doneTextReady: "You've completed all questions! Ready to see your matches?",
		doneTextExchange: 'Now exchange codes with your partner to see your matches.',
		shareStep: 'Share YOUR code with your partner',
		partnerCodeStep: "Get your partner's code and enter it below",
		skipForNow: "Skip for now, I'll enter it later",
		viewResults: 'View Results'
	},
	results: {
		almostTitle: 'Almost There!',
		almostText: "Enter your partner's code to see your mutual matches.",
		privacyInfo:
			"Both of you need to complete the questionnaire and exchange codes. This ensures mutual privacy - no one can see the other's answers until both have committed!",
		noMatchTitle: 'No Matches Found',
		noMatchText:
			"You and your partner didn't both say \"yes\" to any of the same things. That's okay! Everyone has different preferences.",
		noMatchSuggest:
			'Consider reviewing your answers or having an open conversation about your desires.',
		updateAnswers: 'Update My Answers',
		matchesTitle: 'Your Matches',
		matchesSingular: 'You both said "yes" to {n} thing!',
		matchesPlural: 'You both said "yes" to {n} things!',
		sharePrompt: 'Share your code with your partner so they can see the results too!',
		whatsNextTitle: "What's next?",
		whatsNextText:
			"These are things you both expressed interest in! Have an open conversation and decide together what you'd like to explore."
	},
	progressBar: {
		questionOf: 'Question {n} of {total}',
		answeredPct: '{n} answered • {pct}%'
	},
	questionCard: {
		yes: 'Yes',
		maybe: 'Maybe',
		no: 'No'
	},
	shareCode: {
		heading: 'Share this code with your partner',
		copy: 'Copy',
		copied: '✓ Copied!',
		helpText: "They'll enter this code to answer the questions, then you'll both see your matches!"
	},
	partnerCode: {
		heading: "Enter your partner's code",
		placeholder: "Paste partner's code here...",
		submit: 'Submit',
		errorEmpty: 'Please enter a code',
		errorOwn: "That's your own code! You need your partner's code.",
		errorInvalid: 'Invalid code. Please check and try again.'
	}
};

export default en;
export type Translations = typeof en;
