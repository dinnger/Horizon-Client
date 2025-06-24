import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export interface Theme {
	value: string;
	label: string;
	icon: string;
	colors: string[];
}

export interface NotificationSettings {
	general: boolean;
	workflowExecution: boolean;
	errors: boolean;
	systemUpdates: boolean;
	projectReminders: boolean;
}

export interface PerformanceSettings {
	reducedAnimations: boolean;
	autoSave: boolean;
}

export interface PrivacySettings {
	telemetry: boolean;
	localCache: boolean;
}

export interface UserSettings {
	theme: string;
	fontSize: number;
	canvasRefreshRate: number;
	language: string;
	notifications: NotificationSettings;
	performance: PerformanceSettings;
	privacy: PrivacySettings;
}

export const useSettingsStore = defineStore("settings", () => {
	// Current settings
	const currentTheme = ref("crystal");
	const fontSize = ref(16);
	const canvasRefreshRate = ref(33);
	const language = ref("es");

	const notifications = reactive<NotificationSettings>({
		general: true,
		workflowExecution: true,
		errors: true,
		systemUpdates: false,
		projectReminders: true,
	});

	const performance = reactive<PerformanceSettings>({
		reducedAnimations: false,
		autoSave: true,
	});

	const privacy = reactive<PrivacySettings>({
		telemetry: false,
		localCache: true,
	});

	// Available themes
	const availableThemes = ref<Theme[]>([
		{
			value: "crystal",
			label: "Crystal Light",
			icon: "IconSun",
			colors: ["bg-blue-500", "bg-purple-500", "bg-cyan-500"],
		},
		{
			value: "crystal-dark",
			label: "Crystal Dark",
			icon: "IconMoon",
			colors: ["bg-blue-400", "bg-purple-400", "bg-cyan-400"],
		},
		{
			value: "cyberpunk",
			label: "Cyberpunk",
			icon: "IconPalette",
			colors: ["bg-pink-500", "bg-cyan-500", "bg-yellow-500"],
		},
		{
			value: "synthwave",
			label: "Synthwave",
			icon: "IconPalette",
			colors: ["bg-purple-500", "bg-pink-500", "bg-blue-500"],
		},
		{
			value: "luxury",
			label: "Luxury",
			icon: "IconPalette",
			colors: ["bg-amber-500", "bg-slate-700", "bg-red-600"],
		},
		{
			value: "dracula",
			label: "Dracula",
			icon: "IconMoon",
			colors: ["bg-purple-500", "bg-pink-500", "bg-green-500"],
		},
	]);

	// Actions
	const setTheme = (theme: string) => {
		currentTheme.value = theme;
		document.documentElement.setAttribute("data-theme", theme);
		saveSettings();
	};

	const setFontSize = (size: number) => {
		fontSize.value = size;
		document.documentElement.style.fontSize = `${size}px`;
		saveSettings();
	};

	const setCanvasRefreshRate = (rate: number) => {
		canvasRefreshRate.value = rate;
		saveSettings();
	};

	const setLanguage = (lang: string) => {
		language.value = lang;
		saveSettings();
	};

	const updateNotifications = (
		key: keyof NotificationSettings,
		value: boolean,
	) => {
		notifications[key] = value;
		saveSettings();
	};

	const updatePerformance = (
		key: keyof PerformanceSettings,
		value: boolean,
	) => {
		performance[key] = value;
		saveSettings();
	};

	const updatePrivacy = (key: keyof PrivacySettings, value: boolean) => {
		privacy[key] = value;
		saveSettings();
	};

	const saveSettings = () => {
		const settings: UserSettings = {
			theme: currentTheme.value,
			fontSize: fontSize.value,
			canvasRefreshRate: canvasRefreshRate.value,
			language: language.value,
			notifications: { ...notifications },
			performance: { ...performance },
			privacy: { ...privacy },
		};

		localStorage.setItem("horizon-settings", JSON.stringify(settings));
	};

	const loadSettings = () => {
		const saved = localStorage.getItem("horizon-settings");
		if (saved) {
			try {
				const settings: UserSettings = JSON.parse(saved);

				currentTheme.value = settings.theme || "crystal";
				fontSize.value = settings.fontSize || 16;
				canvasRefreshRate.value = settings.canvasRefreshRate || 33;
				language.value = settings.language || "es";

				if (settings.notifications) {
					Object.assign(notifications, settings.notifications);
				}
				if (settings.performance) {
					Object.assign(performance, settings.performance);
				}
				if (settings.privacy) {
					Object.assign(privacy, settings.privacy);
				}

				// Apply theme and font size
				setTheme(currentTheme.value);
				setFontSize(fontSize.value);
			} catch (e) {
				console.error("Error loading settings:", e);
			}
		}
	};

	const exportData = () => {
		const data = {
			settings: {
				theme: currentTheme.value,
				fontSize: fontSize.value,
				canvasRefreshRate: canvasRefreshRate.value,
				language: language.value,
				notifications: notifications,
				performance: performance,
				privacy: privacy,
			},
			timestamp: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "horizon-settings.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const clearData = () => {
		if (
			confirm(
				"¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.",
			)
		) {
			localStorage.clear();
			// Reset to defaults
			currentTheme.value = "crystal";
			fontSize.value = 16;
			canvasRefreshRate.value = 33;
			language.value = "es";

			Object.assign(notifications, {
				general: true,
				workflowExecution: true,
				errors: true,
				systemUpdates: false,
				projectReminders: true,
			});

			Object.assign(performance, {
				reducedAnimations: false,
				autoSave: true,
			});

			Object.assign(privacy, {
				telemetry: false,
				localCache: true,
			});

			alert("Datos limpiados. La página se recargará.");
			window.location.reload();
		}
	};

	const importSettings = (settingsData: UserSettings) => {
		currentTheme.value = settingsData.theme || "crystal";
		fontSize.value = settingsData.fontSize || 16;
		canvasRefreshRate.value = settingsData.canvasRefreshRate || 33;
		language.value = settingsData.language || "es";

		if (settingsData.notifications) {
			Object.assign(notifications, settingsData.notifications);
		}
		if (settingsData.performance) {
			Object.assign(performance, settingsData.performance);
		}
		if (settingsData.privacy) {
			Object.assign(privacy, settingsData.privacy);
		}

		saveSettings();
		setTheme(currentTheme.value);
		setFontSize(fontSize.value);
	};

	const resetToDefaults = () => {
		if (
			confirm(
				"¿Estás seguro de que quieres restablecer todas las configuraciones a los valores por defecto?",
			)
		) {
			currentTheme.value = "crystal";
			fontSize.value = 16;
			canvasRefreshRate.value = 33;
			language.value = "es";

			Object.assign(notifications, {
				general: true,
				workflowExecution: true,
				errors: true,
				systemUpdates: false,
				projectReminders: true,
			});

			Object.assign(performance, {
				reducedAnimations: false,
				autoSave: true,
			});

			Object.assign(privacy, {
				telemetry: false,
				localCache: true,
			});

			saveSettings();
			setTheme(currentTheme.value);
			setFontSize(fontSize.value);
		}
	};

	return {
		// State
		currentTheme,
		fontSize,
		canvasRefreshRate,
		language,
		notifications,
		performance,
		privacy,
		availableThemes,

		// Actions
		setTheme,
		setFontSize,
		setCanvasRefreshRate,
		setLanguage,
		updateNotifications,
		updatePerformance,
		updatePrivacy,
		saveSettings,
		loadSettings,
		exportData,
		clearData,
		importSettings,
		resetToDefaults,
	};
});
