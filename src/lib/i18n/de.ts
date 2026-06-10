import type { Translations } from './en';

const de: Translations = {
	layout: {
		footer: 'Mit Datenschutz im Sinn entwickelt. Deine Antworten werden nur lokal gespeichert.'
	},
	home: {
		title: 'Gemeinsam entdecken',
		subtitle: 'Ein privater Weg für Paare, ihre Intimwünsche zu erkunden',
		howItWorks: 'So funktioniert es',
		step1Title: 'Fragen beantworten',
		step1Desc: 'Beantworte Fragen zu deinen Vorlieben und Wünschen – ganz privat',
		step2Title: 'Code teilen',
		step2Desc: 'Erhalte einen einzigartigen Code, den du mit deinem Partner teilst',
		step3Title: 'Übereinstimmungen entdecken',
		step3Desc: 'Sieh nur, wozu ihr beide „Ja" gesagt habt – keine peinlichen Momente!',
		startNew: 'Neue Sitzung starten',
		joinPartner: 'Partner beitreten',
		privacy: '100% privat – Antworten nur auf deinem Gerät gespeichert',
		noAccounts: 'Keine Konten. Keine Datenbank. Kein Tracking.'
	},
	join: {
		title: 'Partner beitreten',
		subtitle: 'Gib den Code ein, den dein Partner mit dir geteilt hat',
		codeLabel: 'Code des Partners',
		codePlaceholder: 'Code hier eingeben...',
		submit: 'Weiter zu den Fragen',
		backHome: 'Zurück zur Startseite',
		whatNextTitle: 'Was passiert als nächstes?',
		whatNextItem1: 'Du beantwortest dieselben Fragen',
		whatNextItem2: 'Du erhältst DEINEN eigenen Code zum Zurückteilen',
		whatNextItem3: 'Sobald ihr beide Codes getauscht habt, seht ihr eure Übereinstimmungen',
		whatNextPrivacy: 'Dieser beidseitige Austausch gewährleistet vollständige Privatsphäre!',
		errorEmpty: 'Bitte gib einen Code ein',
		errorInvalid: 'Ungültiger Code. Bitte überprüfe ihn und versuche es erneut.'
	},
	questionnaire: {
		answered: '{current} von {total} beantwortet',
		backButton: '← Zurück',
		doneTitle: 'Alles erledigt!',
		doneTextReady: 'Du hast alle Fragen beantwortet! Bereit, deine Übereinstimmungen zu sehen?',
		doneTextExchange: 'Tauscht jetzt Codes mit deinem Partner aus, um eure Übereinstimmungen zu sehen.',
		shareStep: 'Teile DEINEN Code mit deinem Partner',
		partnerCodeStep: 'Hol dir den Code deines Partners und gib ihn unten ein',
		skipForNow: 'Jetzt überspringen, ich gebe ihn später ein',
		viewResults: 'Ergebnisse anzeigen'
	},
	results: {
		almostTitle: 'Fast geschafft!',
		almostText: 'Gib den Code deines Partners ein, um eure gemeinsamen Übereinstimmungen zu sehen.',
		privacyInfo:
			'Ihr beide müsst den Fragebogen ausfüllen und Codes tauschen. Das gewährleistet gegenseitige Privatsphäre – niemand kann die Antworten des anderen sehen, bis beide zugestimmt haben!',
		noMatchTitle: 'Keine Übereinstimmungen gefunden',
		noMatchText:
			'Ihr habt bei keiner Sache beide „Ja" gesagt. Das ist okay! Jeder hat andere Vorlieben.',
		noMatchSuggest:
			'Überleg dir, deine Antworten zu überprüfen oder ein offenes Gespräch über eure Wünsche zu führen.',
		updateAnswers: 'Meine Antworten aktualisieren',
		matchesTitle: 'Eure Übereinstimmungen',
		matchesSingular: 'Ihr habt bei {n} Sache beide „Ja" gesagt!',
		matchesPlural: 'Ihr habt bei {n} Sachen beide „Ja" gesagt!',
		sharePrompt: 'Teile deinen Code mit deinem Partner, damit er die Ergebnisse auch sehen kann!',
		whatsNextTitle: 'Was nun?',
		whatsNextText:
			'Das sind Dinge, für die ihr beide Interesse gezeigt habt! Führt ein offenes Gespräch und entscheidet gemeinsam, was ihr erkunden möchtet.'
	},
	progressBar: {
		questionOf: 'Frage {n} von {total}',
		answeredPct: '{n} beantwortet • {pct}%'
	},
	questionCard: {
		yes: 'Ja',
		maybe: 'Vielleicht',
		no: 'Nein'
	},
	shareCode: {
		heading: 'Teile diesen Code mit deinem Partner',
		copy: 'Kopieren',
		copied: '✓ Kopiert!',
		helpText:
			'Dein Partner gibt diesen Code ein, um die Fragen zu beantworten – dann seht ihr beide eure Übereinstimmungen!'
	},
	partnerCode: {
		heading: 'Gib den Code deines Partners ein',
		placeholder: 'Code des Partners hier einfügen...',
		submit: 'Bestätigen',
		errorEmpty: 'Bitte gib einen Code ein',
		errorOwn: 'Das ist dein eigener Code! Du brauchst den Code deines Partners.',
		errorInvalid: 'Ungültiger Code. Bitte überprüfe ihn und versuche es erneut.'
	}
};

export default de;
