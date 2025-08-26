import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { Navbar, WelcomeSection } from "./components";


const About = lazy(() =>
	import("./components").then((m) => ({ default: m.About }))
);
const Experience = lazy(() =>
	import("./components").then((m) => ({ default: m.Experience }))
);
const Contact = lazy(() =>
	import("./components").then((m) => ({ default: m.Contact }))
);
const StarsCanvas = lazy(() =>
	import("./components").then((m) => ({ default: m.StarsCanvas }))
);


const SectionFallback = ({ h = "60vh" }) => (
	<div style={{ minHeight: h }} aria-hidden="true" />
);

const App = () => {
	return (
		<BrowserRouter>
			<div className="relative z-0 bg-primary">
				<div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
					<Navbar />
					<WelcomeSection />
				</div>

				<Suspense fallback={<SectionFallback h="60vh" />}>
					<About />
				</Suspense>

				<Suspense fallback={<SectionFallback h="60vh" />}>
					<Experience />
				</Suspense>


				<div className="relative z-10">
					<Suspense fallback={<SectionFallback h="80vh" />}>
						<Contact />
					</Suspense>
					<Suspense fallback={null}>
						<StarsCanvas />
					</Suspense>
				</div>

			</div>
		</BrowserRouter>
	);
};

export default App;
