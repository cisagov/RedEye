import { Field, Query, ObjectType, Ctx, Resolver, registerEnumType } from 'type-graphql';
import { ServerDelineationTypes, UploadType, ValidationMode } from '@redeye/parser-core';
import type { GraphQLContext } from '../types';

@Resolver()
export class ParserResolvers {
	@Query(() => [ParserInfo])
	async parserInfo(@Ctx() ctx: GraphQLContext): Promise<ParserInfo[]> {
		return Object.values(ctx.parserInfo).map((info) => new ParserInfo(info));
	}
}

registerEnumType(ServerDelineationTypes, {
	name: 'ServerDelineationTypes',
});

registerEnumType(UploadType, {
	name: 'UploadType',
});

registerEnumType(ValidationMode, {
	name: 'ValidationMode',
});

@ObjectType('FileUpload')
class FileUpload {
	constructor(args: FileUpload) {
		Object.assign(this, args);
	}

	@Field(() => String)
	description!: string;

	@Field(() => UploadType)
	type!: keyof typeof UploadType;

	@Field(() => ValidationMode)
	validate!: keyof typeof ValidationMode;

	@Field(() => String, { nullable: true })
	example?: string;

	@Field(() => [String], { nullable: true })
	acceptedExtensions?: string[];
}

@ObjectType('FileDisplay')
class FileDisplay {
	constructor(args: FileDisplay) {
		Object.assign(this, args);
	}

	@Field(() => Boolean)
	editable!: boolean;
}

@ObjectType('UploadForm')
class UploadForm {
	constructor(args: UploadForm) {
		this.tabTitle = args.tabTitle;
		this.enabledInBlueTeam = args.enabledInBlueTeam;
		this.serverDelineation = args.serverDelineation;
		this.fileUpload = new FileUpload(args.fileUpload);
		this.fileDisplay = new FileDisplay(args.fileDisplay);
	}

	@Field(() => String)
	tabTitle: string;

	@Field(() => Boolean)
	enabledInBlueTeam: boolean;

	@Field(() => FileUpload)
	fileUpload: FileUpload;

	@Field(() => FileDisplay)
	fileDisplay: FileDisplay;

	@Field(() => ServerDelineationTypes)
	serverDelineation: keyof typeof ServerDelineationTypes;
}

@ObjectType('ParserInfo')
class ParserInfo {
	constructor(args: ParserInfo) {
		this.id = args.id;
		this.name = args.name;
		this.version = args.version;
		this.uploadForm = new UploadForm(args.uploadForm);
	}

	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => UploadForm)
	uploadForm: UploadForm;

	@Field(() => Number)
	version: number;
}
