import { BrowserRouter } from "react-router-dom";

import {
	Feedbacks,
	WelcomeSection,
	Navbar,
	StarsCanvas,
	About,
	Works,
	Contact,
} from "./components";

const App = () => {
	return (
		<BrowserRouter>
			<div className="relative z-0 bg-primary">
				<div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
					<Navbar />
					<WelcomeSection />
				</div>
				<About />
				<Works />
				<Feedbacks />
				<div className="relative z-10">
					<Contact />
					<StarsCanvas />
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
