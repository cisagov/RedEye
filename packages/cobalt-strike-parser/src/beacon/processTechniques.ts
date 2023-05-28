import { Annotation, Command, CommandGroup, Tag } from '@redeye/models';
import { GenerationType, mitreTechniques, MitreTechniques } from '@redeye/models';
import { SqlEntityManager, BetterSqliteDriver } from '@mikro-orm/better-sqlite';

export const processTechniques =
	(em: SqlEntityManager<BetterSqliteDriver>, attackIds: string[], command: Command) => async () => {
		const mitreTechnique = new Set<MitreTechniques>();
		attackIds?.forEach((attackId: string) => {
			Object.entries(mitreTechniques).forEach(([technique, attackIds]: [string, string[]]) => {
				if (attackIds.some((atkId: string) => attackId.startsWith(atkId))) {
					mitreTechnique.add(technique as MitreTechniques);
				}
			});
		});

		if (mitreTechnique.size) {
			const tags = await Tag.createTags(em, Array.from(mitreTechnique.values()) ?? [], true);
			const annotation = await Annotation.createAnnotation(em, command.inputText || '', '', {
				favorite: false,
				generation: GenerationType.PROCEDURAL,
			});
			await em.nativeInsert(annotation);
			await Promise.all(
				tags.map(async (tag) => {
					await em
						.getDriver()
						.execute(`INSERT INTO annotation_tags (annotation_id, tag_id) VALUES (?, ?)`, [annotation.id, tag.id]);
				})
			);
			const commandGroup = new CommandGroup({ id: command.id + '-group', generation: GenerationType.PROCEDURAL });
			await em.nativeInsert(commandGroup);
			await em
				.getDriver()
				.execute(`INSERT INTO command_group_commands (command_group_id, command_id) VALUES (?, ?)`, [
					commandGroup.id,
					command.id,
				]);
			await em
				.getDriver()
				.execute(`UPDATE annotation SET command_group_id = ? WHERE id = ?`, [commandGroup.id, annotation.id]);
			return true;
		}
		return false;
	};
