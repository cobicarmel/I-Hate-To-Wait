/** @namespace chrome.i18n */

const IMAGES_DIR = 'images';

var ImmediatelyUnlock = {
	components: {},
	properties: {},
	settings: {},
    error: function (message) {

        alert(message);
    },
	getSiteTag: function(){

        var tag = this.supportedSites[location.hostname.replace(/^www\./, '')];

        if(tag)
            return tag;

        Object.keys(this.supportedSites).forEach(function (key) {

            if(! /^\/.+\/$/.test(key))
                return;

            var regex = new RegExp(key.slice(1, -1));

            if(regex.test(location.hostname)){

                tag = ImmediatelyUnlock.supportedSites[key];

                return false;
            }
        });

		return tag;
	},
	getUnlockHandler: function(){

		return this.unlockHandlers[this.getSiteTag()];
	},
	init: function(){

		var self = this;

		self.initProperties();

		self.initComponents();

		self.run();
	},
	initComponents: function(){

		this.components.$indicator = $('#indicator');

		this.components.$indicatorImage = $('#indicator-image');

		this.components.$indicatorMessage = $('#indicator-message');
	},
	isSupportedSite: function(){

		return !!this.properties.unlockHandler;
	},
	initProperties: function(){

		this.properties.unlockHandler = this.getUnlockHandler();
	},
	onUnlockSuccess: function(){

		this.components.$indicator.text('unlock success!');
	},
	supportedAppearance: function(){

		chrome.extension.sendMessage({
			action: 'markSupportedSite'
		});
	},
	run: function(){

		if(!this.isSupportedSite())
			return;

		this.supportedAppearance();

		this.unlock();
	},
	success: function(){

		this.writeStatus(chrome.i18n.getMessage('unlockSuccess'), 'done1.png');
	},
	unlock: function(){

		var unlockHandler = this.getUnlockHandler();

		if(unlockHandler())
			this.success();
	},
	wait: function(){

		this.writeStatus(chrome.i18n.getMessage('pleaseWait'), 'loader.gif');
	},
	writeStatus: function(message, image){

		this.components.$indicatorMessage.text(message);

		this.components.$indicatorImage.attr('src', image ? IMAGES_DIR + '/' + image : '');
	}
};