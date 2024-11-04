import fs from "node:fs";
import * as dotenv from "dotenv";
import type { TopologyNodeConfig } from "./index.js";

export function loadConfig(
	configPath?: string | undefined,
): TopologyNodeConfig | undefined {
	let config: TopologyNodeConfig | undefined;

	if (configPath) {
		config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		return config;
	}

	const result = dotenv.config();
	if (!result.error) {
		config = {};
		config.network_config = {
			addresses: process.env.ADDRESSES
				? process.env.ADDRESSES.split(",")
				: undefined,
			bootstrap: process.env.BOOTSTRAP
				? process.env.BOOTSTRAP === "true"
				: undefined,
			bootstrap_peers: process.env.BOOTSTRAP_PEERS
				? process.env.BOOTSTRAP_PEERS.split(",")
				: undefined,
			browser_metrics: process.env.BROWSER_METRICS
				? process.env.BROWSER_METRICS === "true"
				: undefined,
			private_key_seed: process.env.PRIVATE_KEY_SEED
				? process.env.PRIVATE_KEY_SEED
				: undefined,
		};
		return config;
	}

	return config;
}
