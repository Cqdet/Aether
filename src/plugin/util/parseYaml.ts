import { YAML } from '../../../deps.ts';

export default function parseYaml(file: string) {
	return YAML.parse(file);
}
