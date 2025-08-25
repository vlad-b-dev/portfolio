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
		title: "About",
	},
	{
		id: "work",
		title: "Work",
	},
	{
		id: "contact",
		title: "Contact",
	},
];

const habilities = [
	{
		title: "Full-stack development",
		icon: fullStack,
	},
	{
		title: "Modern frameworks",
		icon: modernFrameworks,
	},
	{
		title: "UX/UI | 3D Web",
		icon: web3d,
	},
	{
		title: "QA | Testing",
		icon: qaAndTesting,
	},
	{
		title: "Graphic design",
		icon: graphicDesign,
	},
	{
		title: "Scrum-Agile",
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
	android: "text-[#3DDC84]",
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
		name: "Report Wizard",
		description:
			"Report editing application that empowers clients to create customizable reports. Design layouts, integrate graphics, and organize content with drag-and-drop, giving complete control to the user.",
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
		name: "Components library",
		description:
			"Library of visual components, adapted to the company style and fully customizable. Components can be used throughout the app, especially for dynamic filter configuration at Report Wizard.",
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
		name: "Report Visor | Scheduler",
		description:
			"Viewer that lets users run generated reports and export them in various formats, via a custom report engine. Includes a scheduler to send reports by email at configured times and recipients.",
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
		name: "Portfolio",
		description:
			"Personal portfolio focused on UX/UI, performance, and an exceptional user experience. Showcases data clearly, highlights 3D interactions, and is an example of my work while exploring new technologies.",
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
		link: "https://vladyslav-boychuk.vercel.app/",
	},
	{
		name: "All-In",
		description:
			"My first website, personally developed and deployed. While the design and UX were basic, the project was a valuable learning experience that kickstarted my journey in frontend development and user experience.",
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
		name: "BMWays",
		description:
			"Android application developed with a friend during university. Organizes information for repairs, including guides and parts available for purchase. While not yet launched, was our first experience in mobile development.",
		tags: ["android", "database", "curl"].map((name) => ({
			name,
			color: getTagColor(name),
		})),
		image: bmwaysLogo,
		source_code_link: "https://github.com/vlad-b-dev/BMWays",
	},
];

const activeProjects = [
	{
		name: "CoinPulse",
		description:
			"Collaborative project in mid-development stage. It tracks launched cryptocurrencies from fast-updating sources and notifies users of significant price variations. Alerts are sent with all key data, enabling quick decisions ahead of slower platforms.",
		tags: ["cryptocurrency", "Python", "HTML_Parser", "Telegram"].map(
			(name) => ({ name, color: getTagColor(name) }),
		),
		image: coinPulseLogo,
		source_code_link: "https://github.com/vlad-b-dev/python-gate-bot",
	},
	{
		name: "Kila App",
		description:
			"Android application with a concept similar to Wallapop, but focused on renting. Enables users to rent items they need temporarily, or to lend out things they’re not using. Initially a university project, we plan to restart development with the goal of launching it.",
		tags: ["Social", "Transactions", "Android"].map((name) => ({
			name,
			color: getTagColor(name),
		})),
		image: kilaAppLogo,
		source_code_link: "https://github.com/vlad-b-dev/KilaAppAndroid",
	},
	{
		name: "VibeCast",
		description:
			"YouTube clone currently in planning, set to start soon. The project aims to improve my skills in broadcasting and managing large amounts of data, while also focusing on UX and UI design.",
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
