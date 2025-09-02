import {
	fullStack,
	agileScrum,
	web3d,
	qaAndTesting,
	graphicDesign,
	modernFrameworks,
	reportWizardLogo,
	zeoLogo,
	reportVisorLogo,
	portfolioLogo,
	allInLogo,
	bmwaysLogo,
	coinPulseLogo,
	kilaAppLogo,
	vibeCastLogo,
} from "../assets";

export const navLinks = [
	{
		id: "about",
	},
	{
		id: "experience",
	},
	{
		id: "contact",
	},
];

const habilities = [
	{
		id: "fullStack",
		icon: fullStack,
	},
	{
		id: "modernFrameworks",
		icon: modernFrameworks,
	},
	{
		id: "uxUi3d",
		icon: web3d,
	},
	{
		id: "qaAndTesting",
		icon: qaAndTesting,
	},
	{
		id: "graphicDesign",
		icon: graphicDesign,
	},
	{
		id: "scrum",
		icon: agileScrum,
	},
];

const skillColors = {
	SpringBoot: "text-[#4EC9B0]",
	Angular: "text-[#C586C0]",
	Datasets: "text-[#D4D4D4]",
	SourceTree: "text-[#9CDCFE]",
	testing: "text-[#CE9178]",
	Mockito: "text-[#D16969]",
	SQL: "text-[#B5CEA8]",
	PrimeNG: "text-[#C586C0]",
	SCSS: "text-[#CE9178]",
	Java: "text-[#D4D4D4]",
	VisualStudioCode: "text-[#9CDCFE]",
	OOP: "text-[#4EC9B0]",
	Junit: "text-[#D16969]",
	Microservices: "text-[#4EC9B0]",
	Cron: "text-[#D4D4D4]",
	APIs: "text-[#9CDCFE]",
	QA: "text-[#CE9178]",
	SonarQube: "text-[#B5CEA8]",
	IntelliJ: "text-[#D16969]",
	Hibernate: "text-[#C586C0]",
	Cursor: "text-[#4EC9B0]",
	Tailwind: "text-[#9CDCFE]",
	"Three.js": "text-[#D4D4D4]",
	"UX/UI": "text-[#CE9178]",
	responsive: "text-[#B5CEA8]",
	Blender: "text-[#D16969]",
	FramerMotion: "text-[#C586C0]",
	Vite: "text-[#9CDCFE]",
	performance: "text-[#4EC9B0]",
	React: "text-[#61DAFB]",
	Themes: "text-[#D4D4D4]",
	i18n: "text-[#CE9178]",
	GitCracken: "text-[#B5CEA8]",
	Supermaven: "text-[#D16969]",
	lighthouse: "text-[#9CDCFE]",
	Canva: "text-[#C586C0]",
	Inkscape: "text-[#4EC9B0]",
	Android: "text-[#3DDC84]",
	database: "text-[#B5CEA8]",
	curl: "text-[#CE9178]",
	cryptocurrency: "text-[#D16969]",
	Python: "text-[#3572A5]",
	HTML_Parser: "text-[#E34C26]",
	Telegram: "text-[#0088CC]",
	Social: "text-[#D4D4D4]",
	Transactions: "text-[#CE9178]",
	Broadcasting: "text-[#4EC9B0]",
	Video: "text-[#9CDCFE]",
};

const getTagColor = (tagName) => skillColors[tagName] || "text-white";

const professionalProjects = [
	{
		id:"reportWizard",
		tags: [
			"SpringBoot",
			"Angular",
			"Datasets",
			"SourceTree",
			"testing",
			"Mockito",
			"SQL",
		].map((name) => ({ name, color: getTagColor(name) })),
		image: reportWizardLogo,
	},
	{
		id: "componentsLibrary",
		tags: [
			"Angular",
			"PrimeNG",
			"SCSS",
			"Java",
			"VisualStudioCode",
			"OOP",
			"Junit",
		].map((name) => ({ name, color: getTagColor(name) })),
		image: zeoLogo,
		link: "https://zeotechnology.com/",
	},
	{
		id: "reportVisor",
		tags: [
			"Microservices",
			"Cron",
			"APIs",
			"QA",
			"SonarQube",
			"IntelliJ",
			"Hibernate",
		].map((name) => ({ name, color: getTagColor(name) })),
		image: reportVisorLogo,
	},
];

const acomplishedProjects = [
	{
		id: "portfolio",
		tags: [
			"Cursor",
			"Tailwind",
			"Three.js",
			"UX/UI",
			"responsive",
			"Blender",
			"FramerMotion",
			"Vite",
			"performance",
		].map((name) => ({ name, color: getTagColor(name) })),
		image: portfolioLogo,
		source_code_link: "https://github.com/vlad-b-dev/portfolio",
	},
	{
		id: "allIn",
		tags: [
			"React",
			"Themes",
			"i18n",
			"GitCracken",
			"Supermaven",
			"lighthouse",
			"Canva",
			"Inkscape",
		].map((name) => ({ name, color: getTagColor(name) })),
		image: allInLogo,
		source_code_link: "https://github.com/vlad-b-dev/first-app",
		link: "https://all-in-dev.vercel.app/",
	},
	{
		id: "bmways",
		tags: ["Android", "database", "curl"].map((name) => ({
			name,
			color: getTagColor(name),
		})),
		image: bmwaysLogo,
		source_code_link: "https://github.com/vlad-b-dev/BMWays",
	},
];

const activeProjects = [
	{
		id: "coinPulse",
		tags: ["cryptocurrency", "Python", "HTML_Parser", "Telegram"].map(
			(name) => ({ name, color: getTagColor(name) }),
		),
		image: coinPulseLogo,
		source_code_link: "https://github.com/vlad-b-dev/python-gate-bot",
	},
	{
		id: "kilaApp",
		tags: ["Social", "Transactions", "Android"].map((name) => ({
			name,
			color: getTagColor(name),
		})),
		image: kilaAppLogo,
		source_code_link: "https://github.com/vlad-b-dev/KilaAppAndroid",
	},
	{
		id: "vibeCast",
		tags: ["Broadcasting", "Video", "UX/UI"].map((name) => ({
			name,
			color: getTagColor(name),
		})),
		image: vibeCastLogo,
	},
];

export {
	habilities,
	professionalProjects,
	activeProjects,
	acomplishedProjects,
};
