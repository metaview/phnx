/***************************************************************************
 **
 ** Copyright (c) 2012, Tarek Galal <tarek@wazapp.im>
 **
 ** This file is part of Wazapp, an IM application for Meego Harmattan
 ** platform that allows communication with Whatsapp users.
 **
 ** Wazapp is free software: you can redistribute it and/or modify it under
 ** the terms of the GNU General Public License as published by the
 ** Free Software Foundation, either version 2 of the License, or
 ** (at your option) any later version.
 **
 ** Wazapp is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 ** See the GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with Wazapp. If not, see http://www.gnu.org/licenses/.
 **
 ****************************************************************************/

/* emojify by brkn and knobtviker */
/* softbank emoji by knobtviker */
/* IOS 6 support by brkn */
/* emoji and emoji_replacer function should be unified/merged */
/* modifications for unicode as related to ProjectMacaw on webOS by baldric555 */

var prevCode = 0;
var emojiHashTable = new HashTable(); //Added by DC


function decimalToHex(d, padding) {
	var hex = Number(d).toString(16);
	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
	while (hex.length < padding) {
		hex = "0" + hex;
	}
	//console.log("CODE HEX= "+hex)
	return hex;
}

function ord(string) {
	var str = string + ''
	var code = str.charCodeAt(0);

	//console.log("PROCESSING: " + code + " - PrevCode: " + prevCode)
	if ((code != 0xD83C) && (code != 0xD83D) && (prevCode == 0)) {
		//console.log("OLD EMOJI CODE: "+code)
		prevCode = 0
		return code;
	}

	if (prevCode == 0) {
		//console.log("SAVING PREV CODE: "+code)
		prevCode = code;
		return 0;
	}

	if (prevCode > 0) {
		var hi = prevCode;
		var lo = code;
		if (0xD800 <= hi && hi <= 0xDBFF) {
			prevCode = 0
			//console.log("NEW CODE= "+((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000)
			return ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
		}
	}

}

function emojify(stringInput, size) {
	if (!size)
		size = 24; 

	prevCode = 0;
	var pass = 1;
	var leadNum = null;
	var replacedText;
	var myUnicode;
	
	var regx = /([\ue001-\ue537])/g;
	replacedText = stringInput.replace(regx, function(s, eChar) {
		//return '<img height="' + size + '" width="' + size + '" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';
		//return '<img class="emoji" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';
		if(emojiHashTable.hasItem(eChar.charCodeAt(0).toString(16).toUpperCase())){
			myUnicode = emojiHashTable.getItem(eChar.charCodeAt(0).toString(16).toUpperCase());
			return '<img class="emoji" src="images/emoji/' + myUnicode + '.png" />';
		}else{
			return '<img class="emoji" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';
		}
	});
	
	regx = this.getRegxSingles();
	replacedText = replacedText.replace(regx, function(s, eChar) {
		//return '<img height="' + size + '" width="' + size + '" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';		
		return '<img class="emoji" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';		
	});

	//Added by DC
	regx = /(\u0023\u20E3|[\u0030-\u0039]\u20E3)/g;
	replacedText = replacedText.replace(regx, function(s, eChar){
		//return '<img height="' + size + '" width="' + size + '" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '_20E3.png" />';
		return '<img class="emoji" src="images/emoji/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '_20E3.png" />';
	}); //end block DC

	// var replaceRegex = /([\u0080-\uFFFF])/g;
	regx = /(\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF])/g;
	return replacedText.replace(regx, function(str, p1) {
		var hi = p1.charCodeAt(0);
		var lo = p1.charCodeAt(1);
		
		if (0xD800 <= hi && hi <= 0xDBFF) {
			//console.log("NEW CODE= "+((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000)
			var p =  ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
			var res = decimalToHex(p).toString().toUpperCase();
			//Added by DC
			/*Mojo.Log.info("res: " + res);
			Mojo.Log.info("leadNum: " + leadNum);
			if(leadNum != null){
				if(res === "20E3"){
					var tmpLeadNum = leadNum;
					leadNum = null;
					Mojo.Log.info("leadNum: " + tmpLeadNum);
					return res.replace(/^([\da-f]+)$/i, '<img height="' + size + '" width="' + size + '" src="images/emoji/$tmpLeadNum_$1.png" />');
				}
				//else{
				//}
			}*/
			//else{
			if(pass === 1 && (res === "1F1E8" | res ===  "1F1E9" | res === "1F1EA" | res === "1F1EB" | res === "1F1EC" | res === "1F1EE" | res === "1F1EF" | res === "1F1F0" | res === "1F1F7" | res === "1F1FA")){
	  		//return res.replace(/^([\da-f]+)$/i, '<img height="' + size + '" width="' + size + '" src="images/emoji/$1.png" />');		
	  		pass = 2;
	  		//return res.replace(/^([\da-f]+)$/i, '<img height="' + size + '" width="' + size + '" src="images/emoji/$1');
				return res.replace(/^([\da-f]+)$/i, '<img class="emoji" src="images/emoji/$1');
			}		
			else if(pass === 2) {
				if(res === "1F1F3" | res === "1F1EA" | res=== "1F1F8" | res === "1F1F7" | res === "1F1E7" | res === "1F1F9" | res === "1F1F5" | res === "1F1F7" | res === "1F1FA" | res === "1F1F8"){
					pass = 1;
					return res.replace(/^([\da-f]+)$/i, '_$1.png" />');
				}
				else{
					pass = 1;
					return res.concat('.png" />');
				}	
			}
			else {
				//Below is the original line
				//return res.replace(/^([\da-f]+)$/i, '<img height="' + size + '" width="' + size + '" src="images/emoji/$1.png" />');
				return res.replace(/^([\da-f]+)$/i, '<img class="emoji" src="images/emoji/$1.png" />');
				pass = 1;
			}
		}
		return '';

		
		// var p = ord(p1.toString(16))
		// if (p > 0) {
			// var res = decimalToHex(p).toString().toUpperCase()
			// if (p > 8252)
				// return res.replace(/^([\da-f]+)$/i, '<img height="' + size + '" width="' + size + '" src="images/emoji/$1.png" />');
			// else
				// return p1;
		// } else {
			// return '';
		// }
	});
}

function emoji_replacer(str, p1) {
	var p = ord(p1.toString(16))
	if (p > 0) {
		var res = decimalToHex(p).toString().toUpperCase()
		if (p > 8252)
			return res.replace(/^([\da-f]+)$/i, '<img src="/opt/waxmppplugin/bin/wazapp/UI/common/images/emoji/20/$1.png" />');
		else
			return p1
	} else {
		return ''
	}
}

function emojify2(stringInput) {//for textArea
	prevCode = 0
	var replacedText;
	var regx = /([\ue001-\ue537])/g
	replacedText = stringInput.replace(regx, function(s, eChar) {
		return '<img src="/opt/waxmppplugin/bin/wazapp/UI/common/images/emoji/24/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png">';
	});

	var replaceRegex = /([\u0080-\uFFFF])/g;
	return replacedText.replace(replaceRegex, emoji_replacer2);
}

function emoji_replacer2(str, p1) {
	var p = ord(p1.toString(16))
	if (p > 0) {
		var res = decimalToHex(p).toString().toUpperCase()
		if (p > 8252)
			return res.replace(/^([\da-f]+)$/i, '<img src="/opt/waxmppplugin/bin/wazapp/UI/common/images/emoji/24/$1.png">');
		else
			return p1
	} else {
		return ''
	}
}

function emojifyBig(stringInput) {
	prevCode = 0
	var replacedText;
	var regx = /([\ue001-\ue537])/g
	replacedText = stringInput.replace(regx, function(s, eChar) {
		return '<img src="/opt/waxmppplugin/bin/wazapp/UI/common/images/emoji/32/' + eChar.charCodeAt(0).toString(16).toUpperCase() + '.png" />';
	});

	var replaceRegex = /([\u0080-\uFFFF])/g;
	return replacedText.replace(replaceRegex, emoji_replacer3);
}

function emoji_replacer3(str, p1) {
	var p = ord(p1.toString(16))
	if (p > 0) {
		var res = decimalToHex(p).toString().toUpperCase()
		if (p > 8252)
			return res.replace(/^([\da-f]+)$/i, '<img src="/opt/waxmppplugin/bin/wazapp/UI/common/images/emoji/32/$1.png" />');
		else
			return p1
	} else {
		return ''
	}
}

function getUnicodeCharacter(cp) {
	if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
		return [String.fromCharCode(cp), 0];
	} else if (cp >= 0x10000 && cp <= 0x10FFFF) {
		cp -= 0x10000;
		var first = ((0xffc00 & cp) >> 10) + 0xD800
		var second = (0x3ff & cp) + 0xDC00;
		//console.log("RESULT= "+ String.fromCharCode(first) + String.fromCharCode(second))
		return [String.fromCharCode(first) + String.fromCharCode(second), 1];
	}
}

function getCode(inputText) {
	var replacedText;
	var positions = 0;
	var regx = /<img src="\/opt\/waxmppplugin\/bin\/wazapp\/UI\/common\/images\/emoji\/24\/(\w{4,6}).png" \/>/g
	replacedText = inputText.replace(regx, function(s, eChar) {
		var result = getUnicodeCharacter('0x' + eChar);
		var n = result[0]
		positions = positions + result[1]
		return n;
	});
	regx = /<img src="..\/images\/emoji\/24\/(\w{4,6}).png" \/>/g
	replacedText = replacedText.replace(regx, function(s, eChar) {
		var result = getUnicodeCharacter('0x' + eChar);
		var n = result[0]
		positions = positions + result[1]
		return n;
	});
	//console.log("JS: REPLACED TEXT: " + replacedText + " - Chars:" + positions)
	return [replacedText, positions]

}

function getDateText(mydate) {
	var today = new Date();
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	var check = Qt.formatDate(today, "dd-MM-yyyy");
	var check2 = Qt.formatDate(yesterday, "dd-MM-yyyy");
	var str = mydate.slice(0, 10)

	if (str == check)
		return qsTr("Today") + " | " + mydate.slice(11)
	else if (str == check2)
		return qsTr("Yesterday") + " | " + mydate.slice(11)
	else
		return mydate.replace(" ", " | ");
}

/* linkify by @knobtviker */
function linkify(inputText) {
	var replacedText, replacePattern1, replacePattern2, replacePattern3;

	//URLs starting with http://, https://, or ftp://
	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

	//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

	//Change email addresses to mailto:: links.
	replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
	replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

	return replacedText
}

function getRegxSingles() {
	var result = '([';
	for (var i = 0; i < emoji_code_singles.length; i++) {
		result += '\\u' + emoji_code_singles[i];
	}
	
	result += "])";
	return new RegExp(result, "g");
}

var emoji_code = ['E415', 'E057', '1F600', 'E056', 'E414', 'E405', 'E106', 'E418', 'E417', '1F617', '1F619', 'E105', 'E409', '1F61B', 'E40D', 'E404', 'E403', 'E40A', 'E40E', 'E058', 'E406', 'E413', 'E412', 'E411', 'E408', 'E401', 'E40F', '1F605', 'E108', '1F629', '1F62B', 'E40B', 'E107', 'E059', 'E416', '1F624', 'E407', '1F606', '1F60B', 'E40C', '1F60E', '1F634', '1F635', 'E410', '1F61F', '1F626', '1F627', '1F608', 'E11A', '1F62E', '1F62C', '1F610', '1F615', '1F62F', '1F636', '1F607', 'E402', '1F611', 'E516', 'E517', 'E152', 'E51B', 'E51E', 'E51A', 'E001', 'E002', 'E004', 'E005', 'E518', 'E519', 'E515', 'E04E', 'E51C', '1F63A', '1F638', '1F63B', '1F63D', '1F63C', '1F640', '1F63F', '1F639', '1F63E', '1F479', '1F47A', '1F648', '1F649', '1F64A', 'E11C', 'E10C', 'E05A', 'E11D', 'E32E', 'E335', '1F4AB', '1F4A5', 'E334', 'E331', '1F4A7', 'E13C', 'E330', 'E41B', 'E419', 'E41A', '1F445', 'E41C', 'E00E', 'E421', 'E420', 'E00D', 'E010', 'E011', 'E41E', 'E012', 'E422', 'E22E', 'E22F', 'E231', 'E230', 'E427', 'E41D', 'E00F', 'E41F', 'E14C', 'E201', 'E115', 'E51F', 'E428', '1F46A', '1F46C', '1F46D', 'E111', 'E425', 'E429', 'E424', 'E423', 'E253', '1F64B', 'E31E', 'E31F', 'E31D', '1F470', '1F64E', '1F64D', 'E426', 'E503', 'E10E', 'E318', 'E007', '1F45E', 'E31A', 'E13E', 'E31B', 'E006', 'E302', '1F45A', 'E319', '1F3BD', '1F456', 'E321', 'E322', 'E11E', 'E323', '1F45D', '1F45B', '1F453', 'E314', 'E43C', 'E31C', 'E32C', 'E32A', 'E32D', 'E32B', 'E022', 'E023', 'E328', 'E327', '1F495', '1F496', '1F49E', 'E329', '1F48C', 'E003', 'E034', 'E035', '1F464', '1F465', '1F4AC', 'E536', '1F4AD', 'E052', 'E52A', 'E04F', 'E053', 'E524', 'E52C', 'E531', 'E050', 'E527', 'E051', 'E10B', '1F43D', 'E52B', 'E52F', 'E109', 'E528', 'E01A', 'E529', 'E526', '1F43C', 'E055', 'E521', 'E523', '1F425', '1F423', 'E52E', 'E52D', '1F422', 'E525', '1F41D', '1F41C', '1F41E', '1F40C', 'E10A', 'E441', 'E522', 'E019', 'E520', 'E054', '1F40B', '1F404', '1F40F', '1F400', '1F403', '1F405', '1F407', '1F409', 'E134', '1F410', '1F413', '1F415', '1F416', '1F401', '1F402', '1F432', '1F421', '1F40A', 'E530', '1F42A', '1F406', '1F408', '1F429', '1F43E', 'E306', 'E030', 'E304', 'E110', 'E032', 'E305', 'E303', 'E118', 'E447', 'E119', '1F33F', 'E444', '1F344', 'E308', 'E307', '1F332', '1F333', '1F330', '1F331', '1F33C', '1F310', '1F31E', '1F31D', '1F31A', '1F311', '1F312', '1F313', '1F314', '1F315', '1F316', '1F317', '1F318', '1F31C', '1F31B', 'E04C', '1F30D', '1F30E', '1F30F', '1F30B', '1F30C', '1F320', 'E32F', 'E04A', '26C5', 'E049', 'E13D', 'E04B', '2744', 'E048', 'E443', '1F301', 'E44C', 'E43E', 'E436', 'E437', 'E438', 'E43A', 'E439', 'E43B', 'E117', 'E440', 'E442', 'E446', 'E445', 'E11B', 'E448', 'E033', 'E112', '1F38B', 'E312', '1F38A', 'E310', 'E143', '1F52E', 'E03D', 'E008', '1F4F9', 'E129', 'E126', 'E127', 'E316', '1F4BE', 'E00C', 'E00A', 'E009', '1F4DE', '1F4DF', 'E00B', 'E14B', 'E12A', 'E128', 'E141', '1F509', '1F508', '1F507', 'E325', '1F515', 'E142', 'E317', '23F3', '231B', '23F0', '231A', 'E145', 'E144', '1F50F', '1F510', 'E03F', '1F50E', 'E10F', '1F526', '1F506', '1F505', '1F50C', '1F50B', 'E114', '1F6C1', 'E13F', '1F6BF', 'E140', '1F527', '1F529', 'E116', '1F6AA', 'E30E', 'E311', 'E113', '1F52A', 'E30F', 'E13B', 'E12F', '1F4B4', '1F4B5', '1F4B7', '1F4B6', '1F4B3', '1F4B8', 'E104', '1F4E7', '1F4E5', '1F4E4', '2709', 'E103', '1F4E8', '1F4EF', 'E101', '1F4EA', '1F4EC', '1F4ED', 'E102', '1F4E6', 'E301', '1F4C4', '1F4C3', '1F4D1', '1F4CA', '1F4C8', '1F4C9', '1F4DC', '1F4CB', '1F4C5', '1F4C6', '1F4C7', '1F4C1', '1F4C2', 'E313', '1F4CC', '1F4CE', '2712', '270F', '1F4CF', '1F4D0', '1F4D5', '1F4D7', '1F4D8', '1F4D9', '1F4D3', '1F4D4', '1F4D2', '1F4DA', 'E148', '1F516', '1F4DB', '1F52C', '1F52D', '1F4F0', 'E502', 'E324', 'E03C', 'E30A', '1F3BC', 'E03E', 'E326', '1F3B9', '1F3BB', 'E042', 'E040', 'E041', 'E12B', '1F3AE', '1F0CF', '1F3B4', 'E12D', '1F3B2', 'E130', 'E42B', 'E42A', 'E018', 'E016', 'E015', 'E42C', '1F3C9', '1F3B3', 'E014', '1F6B5', '1F6B4', 'E132', '1F3C7', 'E131', 'E013', '1F3C2', 'E42D', 'E017', '1F3A3', 'E045', 'E338', 'E30B', '1F37C', 'E047', 'E30C', 'E044', '1F379', '1F377', 'E043', '1F355', 'E120', 'E33B', '1F357', '1F356', 'E33F', 'E341', '1F364', 'E34C', 'E344', '1F365', 'E342', 'E33D', 'E33E', 'E340', 'E34D', 'E343', 'E33C', 'E147', 'E339', '1F369', '1F36E', 'E33A', '1F368', 'E43F', 'E34B', 'E046', '1F36A', '1F36B', '1F36C', '1F36D', '1F36F', 'E345', '1F34F', 'E346', '1F34B', '1F352', '1F347', 'E348', 'E347', '1F351', '1F348', '1F34C', '1F350', '1F34D', '1F360', 'E34A', 'E349', '1F33D', 'E036', '1F3E1', 'E157', 'E038', 'E153', 'E155', 'E14D', 'E156', 'E501', 'E158', 'E43D', 'E037', 'E504', '1F3E4', 'E44A', 'E146', 'E505', 'E506', 'E122', 'E508', 'E509', '1F5FE', 'E03B', 'E04D', 'E449', 'E44B', 'E51D', '1F309', '1F3A0', 'E124', 'E121', 'E433', 'E202', 'E01C', 'E135', '1F6A3', '2693', 'E10D', 'E01D', 'E11F', '1F681', '1F682', '1F68A', 'E039', '1F69E', '1F686', 'E435', 'E01F', '1F688', 'E434', '1F69D', 'E01E', '1F68B', '1F68E', 'E159', '1F68D', 'E42E', '1F698', 'E01B', 'E15A', '1F696', '1F69B', 'E42F', '1F6A8', 'E432', '1F694', 'E430', 'E431', '1F690', 'E136', '1F6A1', '1F69F', '1F6A0', '1F69C', 'E320', 'E150', 'E125', '1F6A6', 'E14E', 'E252', 'E137', 'E209', 'E03A', '1F3EE', 'E133', 'E123', '1F5FF', '1F3AA', '1F3AD', '1F4CD', '1F6A9', 'E50B', 'E514', 'E50E', 'E513', 'E50C', 'E50D', 'E511', 'E50F', 'E512', 'E510', 'E50A', 'E21C', 'E21D', 'E21E', 'E21F', 'E220', 'E221', 'E222', 'E223', 'E224', 'E225', '1F51F', '1F522', 'E210', '1F523', 'E232', 'E233', 'E235', 'E234', '1F520', '1F521', '1F524', 'E236', 'E237', 'E238', 'E239', '2194', '2195', '1F504', 'E23B', 'E23A', '1F53C', '1F53D', '21A9', '21AA', '2139', 'E23D', 'E23C', '23EB', '23EC', '2935', '2934', 'E24D', '1F500', '1F501', '1F502', 'E212', 'E213', 'E214', '1F193', '1F196', 'E20B', 'E507', 'E203', 'E22C', 'E22B', 'E22A', '1F234', '1F232', 'E226', 'E227', 'E22D', 'E215', 'E216', 'E151', 'E138', 'E139', 'E13A', 'E309', '1F6B0', '1F6AE', 'E14F', 'E20A', 'E208', 'E217', 'E218', 'E228', '24C2', '1F6C2', '1F6C4', '1F6C5', '1F6C3', '1F251', 'E315', 'E30D', '1F191', '1F198', 'E229', '1F6AB', 'E207', '1F4F5', '1F6AF', '1F6B1', '1F6B3', '1F6B7', '1F6B8', '26D4', 'E206', '2747', '274E', '2705', 'E205', 'E204', 'E12E', 'E250', 'E251', 'E532', 'E533', 'E534', 'E535', '1F4A0', 'E211', '267B', 'E23F', 'E240', 'E241', 'E242', 'E243', 'E244', 'E245', 'E246', 'E247', 'E248', 'E249', 'E24A', 'E24B', 'E23E', 'E154', 'E14A', '1F4B2', 'E149', 'E24E', 'E24F', 'E537', 'E12C', '3030', 'E24C', '1F51A', '1F519', '1F51B', '1F51C', 'E333', 'E332', 'E021', 'E020', 'E337', 'E336', '1F503', 'E02F', '1F567', 'E024', '1F55C', 'E025', '1F55D', 'E026', '1F55E', 'E027', '1F55F', 'E028', '1F560', 'E029', 'E02A', 'E02B', 'E02C', 'E02D', 'E02E', '1F561', '1F562', '1F563', '1F564', '1F565', '1F566', '2716', '2795', '2796', '2797', 'E20E', 'E20C', 'E20F', 'E20D', '1F4AE', '1F4AF', '2714', '2611', '1F518', '1F517', '27B0', 'E031', 'E21A', 'E21B', '2B1B', '2B1C', '25FE', '25FD', '25AA', '25AB', '1F53A', '25FB', '25FC', '26AB', '26AA', 'E219', '1F535', '1F53B', '1F536', '1F537', '1F538', '1F539', '2049', '203C'];
//DC added conversion from SoftBank to unicode below
var emoji_code_unicode = ['1F604','1F603','1F600','1F60A','263A','1F609','1F60D','1F618','1F61A','1F617','1F619','1F61C','1F61D','1F61B','1F633','1F601','1F614','1F60C','1F612','1F61E','1F623','1F622','1F602','1F62D','1F62A','1F625','1F630','1F605','1F613','1F629','1F62B','1F628','1F631','1F620','1F621','1F624','1F616','1F606','1F60B','1F637','1F60E','1F634','1F635','1F632','1F61F','1F626','1F627','1F608','1F47F','1F62E','1F62C','1F610','1F615','1F62F','1F636','1F607','1F60F','1F611','1F472','1F473','1F46E','1F477','1F482','1F476','1F466','1F467','1F468','1F469','1F474','1F475','1F471','1F47C','1F478','1F63A','1F638','1F63B','1F63D','1F63C','1F640','1F63F','1F639','1F63E','1F479','1F47A','1F648','1F649','1F64A','1F480','1F47D','1F4A9','1F525','2728','1F31F','1F4AB','1F4A5','1F4A2','1F4A6','1F4A7','1F4A4','1F4A8','1F442','1F440','1F443','1F445','1F444','1F44D','1F44E','1F44C','1F44A','270A','270C','1F44B','270B','1F450','1F446','1F447','1F449','1F448','1F64C','1F64F','261D','1F44F','1F4AA','1F6B6','1F3C3','1F483','1F46B','1F46A','1F46C','1F46D','1F48F','1F491','1F46F','1F646','1F645','1F481','1F64B','1F486','1F487','1F485','1F470','1F64E','1F64D','1F647','1F3A9','1F451','1F452','1F45F','1F45E','1F461','1F460','1F462','1F455','1F454','1F45A','1F457','1F3BD','1F456','1F458','1F459','1F4BC','1F45C','1F45D','1F45B','1F453','1F380','1F302','1F484','1F49B','1F499','1F49C','1F49A','2764','1F494','1F497','1F493','1F495','1F496','1F49E','1F498','1F48C','1F48B','1F48D','1F48E','1F464','1F465','1F4AC','1F463','1F4AD','1F436','1F43A','1F431','1F42D','1F439','1F430','1F438','1F42F','1F428','1F43B','1F437','1F43D','1F42E','1F417','1F435','1F412','1F434','1F411','1F418','1F43C','1F427','1F426','1F424','1F425','1F423','1F414','1F40D','1F422','1F41B','1F41D','1F41C','1F41E','1F40C','1F419','1F41A','1F420','1F41F','1F42C','1F433','1F40B','1F404','1F40F','1F400','1F403','1F405','1F407','1F409','1F40E','1F410','1F413','1F415','1F416','1F401','1F402','1F432','1F421','1F40A','1F42B','1F42A','1F406','1F408','1F429','1F43E','1F490','1F338','1F337','1F340','1F339','1F33B','1F33A','1F341','1F343','1F342','1F33F','1F33E','1F344','1F335','1F334','1F332','1F333','1F330','1F331','1F33C','1F310','1F31E','1F31D','1F31A','1F311','1F312','1F313','1F314','1F315','1F316','1F317','1F318','1F31C','1F31B','1F319','1F30D','1F30E','1F30F','1F30B','1F30C','1F320','2B50','2600','26C5','2601','26A1','2614','2744','26C4','1F300','1F301','1F308','1F30A','1F38D','1F49D','1F38E','1F392','1F393','1F38F','1F386','1F387','1F390','1F391','1F383','1F47B','1F385','1F384','1F381','1F38B','1F389','1F38A','1F388','1F38C','1F52E','1F3A5','1F4F7','1F4F9','1F4FC','1F4BF','1F4C0','1F4BD','1F4BE','1F4BB','1F4F1','260E','1F4DE','1F4DF','1F4E0','1F4E1','1F4FA','1F4FB','1F50A','1F509','1F508','1F507','1F514','1F515','1F4E2','1F4E3','23F3','231B','23F0','231A','1F513','1F512','1F50F','1F510','1F511','1F50E','1F4A1','1F526','1F506','1F505','1F50C','1F50B','1F50D','1F6C1','1F6C0','1F6BF','1F6BD','1F527','1F529','1F528','1F6AA','1F6AC','1F4A3','1F52B','1F52A','1F48A','1F489','1F4B0','1F4B4','1F4B5','1F4B7','1F4B6','1F4B3','1F4B8','1F4F2','1F4E7','1F4E5','1F4E4','2709','1F4E9','1F4E8','1F4EF','1F4EB','1F4EA','1F4EC','1F4ED','1F4EE','1F4E6','1F4DD','1F4C4','1F4C3','1F4D1','1F4CA','1F4C8','1F4C9','1F4DC','1F4CB','1F4C5','1F4C6','1F4C7','1F4C1','1F4C2','2702','1F4CC','1F4CE','2712','270F','1F4CF','1F4D0','1F4D5','1F4D7','1F4D8','1F4D9','1F4D3','1F4D4','1F4D2','1F4DA','1F4D6','1F516','1F4DB','1F52C','1F52D','1F4F0','1F3A8','1F3AC','1F3A4','1F3A7','1F3BC','1F3B5','1F3B6','1F3B9','1F3BB','1F3BA','1F3B7','1F3B8','1F47E','1F3AE','1F0CF','1F3B4','1F004','1F3B2','1F3AF','1F3C8','1F3C0','26BD','26BE','1F3BE','1F3B1','1F3C9','1F3B3','26F3','1F6B5','1F6B4','1F3C1','1F3C7','1F3C6','1F3BF','1F3C2','1F3CA','1F3C4','1F3A3','2615','1F375','1F376','1F37C','1F37A','1F37B','1F378','1F379','1F377','1F374','1F355','1F354','1F35F','1F357','1F356','1F35D','1F35B','1F364','1F371','1F363','1F365','1F359','1F358','1F35A','1F35C','1F372','1F362','1F361','1F373','1F35E','1F369','1F36E','1F366','1F368','1F367','1F382','1F370','1F36A','1F36B','1F36C','1F36D','1F36F','1F34E','1F34F','1F34A','1F34B','1F352','1F347','1F349','1F353','1F351','1F348','1F34C','1F350','1F34D','1F360','1F346','1F345','1F33D','1F3E0','1F3E1','1F3EB','1F3E2','1F3E3','1F3E5','1F3E6','1F3EA','1F3E9','1F3E8','1F492','26EA','1F3EC','1F3E4','1F307','1F306','1F3EF','1F3F0','26FA','1F3ED','1F5FC','1F5FE','1F5FB','1F304','1F305','1F303','1F5FD','1F309','1F3A0','1F3A1','26F2','1F3A2','1F6A2','26F5','1F6A4','1F6A3','2693','1F680','2708','1F4BA','1F681','1F682','1F68A','1F689','1F69E','1F686','1F684','1F685','1F688','1F687','1F69D','1F683','1F68B','1F68E','1F68C','1F68D','1F699','1F698','1F697','1F695','1F696','1F69B','1F69A','1F6A8','1F693','1F694','1F692','1F691','1F690','1F6B2','1F6A1','1F69F','1F6A0','1F69C','1F488','1F68F','1F3AB','1F6A6','1F6A5','26A0','1F6A7','1F530','26FD','1F3EE','1F3B0','2668','1F5FF','1F3AA','1F3AD','1F4CD','1F6A9','1F1EF_0001F1F5','1F1F0_0001F1F7','1F1E9_0001F1EA','1F1E8_0001F1F3','1F1FA_0001F1F8','1F1EB_0001F1F7','1F1EA_0001F1F8','1F1EE_0001F1F9','1F1F7_0001F1FA','1F1EC_0001F1E7','E50A','31_20E3','32_20E3','33_20E3','34_20E3','35_20E3','36_20E3','37_20E3','38_20E3','39_20E3','30_20E3','1F51F','1F522','23_20E3','1F523','2B06','2B07','2B05','27A1','1F520','1F521','1F524','2197','2196','2198','2199','2194','2195','1F504','25C0','25B6','1F53C','1F53D','21A9','21AA','2139','23EA','23E9','23EB','23EC','2935','2934','1F197','1F500','1F501','1F502','1F195','1F199','1F192','1F193','1F196','1F4F6','1F3A6','1F201','1F22F','1F233','1F235','1F234','1F232','1F250','1F239','1F23A','1F236','1F21A','1F6BB','1F6B9','1F6BA','1F6BC','1F6BE','1F6B0','1F6AE','1F17F','267F','1F6AD','1F237','1F238','1F202','24C2','1F6C2','1F6C4','1F6C5','1F6C3','1F251','3299','3297','1F191','1F198','1F194','1F6AB','1F51E','1F4F5','1F6AF','1F6B1','1F6B3','1F6B7','1F6B8','26D4','2733','2747','274E','2705','2734','1F49F','1F19A','1F4F3','1F4F4','1F170','1F171','1F18E','1F17E','1F4A0','27BF','267B','2648','2649','264A','264B','264C','264D','264E','264F','2650','2651','2652','2653','26CE','1F52F','1F3E7','1F4B9','1F4B2','1F4B1','A9','AE','2122','303D','3030','1F51D','1F51A','1F519','1F51B','1F51C','274C','2B55','2757','2753','2755','2754','1F503','1F55B','1F567','1F550','1F55C','1F551','1F55D','1F552','1F55E','1F553','1F55F','1F554','1F560','1F555','1F556','1F557','1F558','1F559','1F55A','1F561','1F562','1F563','1F564','1F565','1F566','2716','2795','2796','2797','2660','2665','2663','2666','1F4AE','1F4AF','2714','2611','1F518','1F517','27B0','1F531','1F532','1F533','2B1B','2B1C','25FE','25FD','25AA','25AB','1F53A','25FB','25FC','26AB','26AA','1F534','1F535','1F53B','1F536','1F537','1F538','1F539','2049','203C'];
//DC added top line codes. 2nd line was from original code
var emoji_code_singles = ['263A','2728','270A','270C','270B','2764','2B50','2600','2601','26A1','2614','26C4','26EA','26FA','26F2','26F5','2708','26A0','26FD','2B06','2B07','2B05','27A1','25C0','25B6','23EA','23E9','267F','303D','2197','2196','2198','2199','3299','3297','2733','2734','27BF','2648','2649','264A','264B','264C','264D','264E','264F','2650','2651','2652','2653','26CE','274C','2757','2753','2755','2754','2B55','2702','26BD','26BE','26F3','2615',
'203C','21AA','23F3','25FD','26AB','2712','2795','2B1B','2049','231A','24C2','25FE','26C5','2714','2796','2B1C','2139','231B','25AA','2611','26D4','2716','2797','2194','23EB','25AB','267B','2705','2744','27B0','2195','23EC','25FB','2693','2709','2747','2934','21A9','23F0','25FC','26AA','270F','274E','2935', '3030'];

//Added by DC
function createEmojiHash() {
	for(var i=0; i<emoji_code.length; i++){
		emojiHashTable.setItem(emoji_code[i],emoji_code_unicode[i]);
	}
}

function newlinefy(inputText) {
	var replacedText, replacePattern1;

	replacePattern1 = /\n/g;
	replacedText = inputText.replace(replacePattern1, '<br/>');

	return replacedText
}

function convertUtf16CodesToString(utf16_codes) {
	var unescaped = '';
	for (var i = 0; i < utf16_codes.length; ++i) {
		unescaped += String.fromCharCode(utf16_codes[i]);
	}
	return unescaped;
}

function convertUnicodeCodePointsToUtf16Codes(unicode_codes) {
	var utf16_codes = [];
	for (var i = 0; i < unicode_codes.length; ++i) {
		var unicode_code = unicode_codes[i];
		if (unicode_code < (1 << 16)) {
			utf16_codes.push(unicode_code);
		} else {
			var first = Math.floor(((unicode_code - (1 << 16)) / (1 << 10))) + 0xD800;
			var second = (unicode_code % (1 << 10)) + 0xDC00;
			utf16_codes.push(first);
			utf16_codes.push(second);
		}
	}
	return utf16_codes;
}

function convertUnicodeCodePointsToString(unicode_codes) {
	var utf16_codes = convertUnicodeCodePointsToUtf16Codes(unicode_codes);
	return convertUtf16CodesToString(utf16_codes);
}
