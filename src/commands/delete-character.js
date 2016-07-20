'use babel';
'use strict';

import database from '../characters/database';
import sendCharacterDisambiguation from '../characters/disambiguation';

export default class DeleteCharacterCommand {
	static get information() {
		return {
			label: 'deletecharacter',
			aliases: ['removecharacter', 'delchar', 'rmchar'],
			description: 'Deletes a character from the database.',
			usage: '!deletecharacter <name>',
			details: 'The name can be the whole name of the character, or just a part of it.',
			examples: ['!deletecharacter Billy McBillface', '!deletecharacter bill']
		};
	}

	static get triggers() {
		return [
			/^!(?:deletecharacter|removecharacter|delchar|rmchar)\s+"?(.+?)"?\s*$/i,
		];
	}

	static isRunnable(message) {
		return !!message.server;
	}

	static run(message, matches) {
		const characters = database.findCharactersInServer(message.server.id, matches[1]);
		if(characters.length === 1) {
			const permissionOverride = message.server.rolesOfUser(message.author).some(role => role.hasPermission('manageMessages') || role.hasPermission('administrator'));
			if(database.deleteCharacter(characters[0], permissionOverride)) {
				message.client.reply(message, 'Deleted character "' + characters[0].name + '".');
			} else {
				message.client.reply(message, 'Unable to delete character "' + characters[0].name + '". You are not the owner.');
			}
		} else if(characters.length > 1) {
			sendCharacterDisambiguation(characters, message);
		} else {
			message.client.reply(message, 'Unable to find character "' + matches[1] + '". Use !characters to see the list of characters.');
		}
	}
}
