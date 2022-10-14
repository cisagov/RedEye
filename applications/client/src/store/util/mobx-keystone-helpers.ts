export const disposeList =
	(...reactions: ((() => any) | undefined | void)[]) =>
	() =>
		reactions.map((reaction) => reaction?.());
