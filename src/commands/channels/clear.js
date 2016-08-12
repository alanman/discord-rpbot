'use babel';
'use strict';

import Channel from '../../database/channel';
import * as permissions from '../../util/permissions';
import usage from '../../util/command-usage';

let lastUser;
let timeout;

export default {
	name: 'clearallowedchannels',
	aliases: ['clearallowedchans', 'clearchannels', 'clearchans'],
	group: 'channels',
	groupName: 'clear',
	description: 'Clears all of the allowed channels. Only administrators may use this command.',
	serverOnly: true,

	isRunnable(message) {
		return permissions.isAdministrator(message.server, message.author);
	},

	async run(message, args) {
		if(message.author.equals(lastUser) && args[0] && args[0].toLowerCase() === 'confirm') {
			Channel.clearServer(message.server);
			clearTimeout(timeout);
			lastUser = null;
			timeout = null;
			return 'Cleared the server\'s allowed channels. Operation is now allowed in all channels.';
		} else {
			if(timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			lastUser = message.author;
			timeout = setTimeout(() => { lastUser = null; }, 30000);
			return `Are you sure you want to clear all of the allowed channels? Operation will be permitted in all channels. Use ${usage('clearallowedchannels confirm', message.server)} to continue.`;
		}
	}
};
