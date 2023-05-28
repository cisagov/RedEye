import { Field, Query, ObjectType, Ctx, Resolver, registerEnumType } from 'type-graphql';
import { ServerDelineationTypes, UploadType, ValidationMode } from '@redeye/models';
import { GraphQLContext } from '../types';

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
	type!: UploadType;

	@Field(() => ValidationMode)
	validate!: ValidationMode;

	@Field(() => [String], { nullable: true })
	acceptedExtensions?: string[];
}

@ObjectType('FileDisplay')
class FileDisplay {
	constructor(args: FileDisplay) {
		Object.assign(this, args);
	}

	@Field(() => String)
	description!: string;

	@Field(() => Boolean)
	editable!: boolean;
}

@ObjectType('UploadForm')
class UploadForm {
	constructor(args: UploadForm) {
		this.tabTitle = args.tabTitle;
		this.enabledInBlueTeam = args.enabledInBlueTeam;
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
}

@ObjectType('ParserInfo')
class ParserInfo {
	constructor({ id, name, version, serverDelineation, uploadForm }: ParserInfo) {
		this.id = id;
		this.name = name;
		this.version = version;
		this.serverDelineation = serverDelineation;
		this.uploadForm = new UploadForm(uploadForm);
	}

	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => UploadForm)
	uploadForm: UploadForm;

	@Field(() => Number)
	version: number;

	@Field(() => ServerDelineationTypes)
	serverDelineation: ServerDelineationTypes;
}
