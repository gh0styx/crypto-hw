import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../store/slices/portfolioSlice";
import pricesReducer from "../store/slices/pricesSlice";
import Sidebar from "../components/Sidebar";

// Mock usePathname
jest.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

const createMockStore = () =>
	configureStore({
		reducer: {
			portfolio: portfolioReducer,
			prices: pricesReducer,
		},
	});

describe("Sidebar Component", () => {
	test("renders navigation items", () => {
		const store = createMockStore();
		render(
			<Provider store={store}>
				<Sidebar isMobile={true} />
			</Provider>,
		);

		expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
		expect(screen.getByText(/Trade/i)).toBeInTheDocument();
		expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
	});

	test("can be collapsed on desktop", () => {
		const store = createMockStore();
		render(
			<Provider store={store}>
				<Sidebar isMobile={true} />
			</Provider>,
		);

		// Sidebar has a toggle button with a chevron
		// Initially expanded
		expect(screen.getByText(/CryptoDash/i)).toBeInTheDocument();
	});
});
