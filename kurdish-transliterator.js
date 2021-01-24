/*
  Copyright (C) 2020 allekok.
  Author: Payam <payambapiri.97@gmail.com>
  License: MIT License
*/
function transliterate_ar2lat (str) {
	return apply_to_words(str, w => ar2lat(w))
}

function transliterate_ar2per (str) {
	return apply_to_words(str, w => ar2per(w))
}

function ar2IL (s) {
	const bizroke = 'i';
	const v = "ەeێêۆoاaiuîûأإآ";
	const n = "قwرڕتyئحعپسشدفگغهژکلڵزخجچڤبنمڎصۊۉثذضظةطؤ";
	const before = [["عیوونی", "عiیوونی"],
			["ئارەزوی", "ئارەزuی"],
			["ئارزوی", "ئارزuی"],
			["^([رڕ])وی$", "$1uی"],
			["^لە([رڕ])وی$", "لە$1uی"],
			["هاووڵا", "هاwwڵا"]];
	const after = [["ûyyî$", "ûyîy"],
		       [`^([مس])ە([رح])u$`, "$1ە$2w"]];
	const notsure = [["وو", "û", "uw", "wu", "ww"],
			 ["یی", "îy", "îy", "yî", "yy"],
			 ["ی", "î", "y"],
			 ["و", "u", "w"]];
	function determine_notsure (R, str) {
		let pos = R[0],
		    ch = R[1][0],
		    ch_len = ch.length,
		    prev_ch = L(str, pos-1),
		    next_ch = L(str, pos+ch_len),
		    next_ch_2 = L(str, pos+ch_len+1),
		    next_v = is_(next_ch, v),
		    next_v_2 = is_(next_ch_2, v),
		    i = 1; // v
		if(prev_ch == '‌') prev_ch = L(str, pos-2);
		let prev_v = is_(prev_ch, v);
		
		if(is_(str, ["وو","یی","ی","و"]));
		else if(ch_len == 2) {
			if(prev_v && !next_v_2 &&
			   (next_v || is_(next_ch,'یو'))) i = 4;
			else if(pos == 0 || prev_v) i = 3;
			else if(next_v) i = 2;
		}
		else if(pos == 0 || prev_v || next_v ||
			(prev_ch != 'y' && ch == 'و' &&
			 next_ch == 'ی' && !next_v_2)) i = 2;
		return i;
	}
	return add_bizroke(replace_sure(replace_notsure(replace_sure(
		standardizing(s), before), notsure, determine_notsure),
					after), n, v, bizroke);
}

function ar2lat (s) {
	const sure = [["أ","ئە"],
		      ["إ","ئی"],
		      ["آ","ئا"],
		      ["َ", "e"],
		      ["ِ", "î"],
		      ["ُ", "u"],
		      ["ە", "e"],
		      ["ێ", "ê"],
		      ["ۆ", "o"],
		      ["ا", "a"],
		      ["ق", "q"],
		      ["ر", "r"],
		      ["ڕ", "ř"],
		      ["ت|ط|ة", "t"],
		      ["ئ|ء|ؤ|ع", "'"],
		      ["ح", "ḧ"],
		      ["پ", "p"],
		      ["س|ث", "s"],
		      ["ص", "ṣ"],
		      ["ش", "ş"],
		      ["د", "d"],
		      ["ف", "f"],
		      ["گ", "g"],
		      ["غ", "ẍ"],
		      ["ه", "h"],
		      ["ژ", "j"],
		      ["ک", "k"],
		      ["ل", "l"],
		      ["ڵ", "ɫ"],
		      ["ز|ض|ظ|ذ", "z"],
		      ["خ", "x"],
		      ["ج", "c"],
		      ["چ", "ç"],
		      ["ڤ", "v"],
		      ["ب", "b"],
		      ["ن", "n"],
		      ["م", "m"],
		      ["ڎ", "ḍ"],
		      ["ۊ", "ü"],
		      ["ۉ", "ṿ"],
		      ["٠|۰", "0"],
		      ["١|۱", "1"],
		      ["٢|۲", "2"],
		      ["٣|۳", "3"],
		      ["٤|۴", "4"],
		      ["٥|۵", "5"],
		      ["٦|۶", "6"],
		      ["٧|۷", "7"],
		      ["٨|۸", "8"],
		      ["٩|۹", "9"],
		      ["،", ","],
		      ["؛", ";"],
		      ["؟", "?"]];
	return replace_sure(ar2IL(s), sure);
}

function ar2per (s) {
	const sure = [["wu", "و\u{64F}"],
		      ["û", "و\u{64F}"],
		      ["ە", "\u{64E}"],
		      ["ێ", "\u{650}"],
		      ["ۆ", "\u{64F}"],
		      ["u", "و"],
		      ["w", "و"],
		      ["y", "ی"],
		      ["î", "ی"],
		      ["i", "\u{652}"],
		      ["٠", "۰"],
		      ["١", "۱"],
		      ["٢", "۲"],
		      ["٣", "۳"],
		      ["٤", "۴"],
		      ["٥", "۵"],
		      ["٦", "۶"],
		      ["٧", "۷"],
		      ["٨", "۸"],
		      ["٩", "۹"]];
	const n = "قرڕتئحعپسشدفگغهژکلڵزخجچڤبنمڎصۊۉثذضظةطؤ";
	const v = "ەێۆاuûîiأإآ";
	/* Tashdid */
	function add_tashdid (str, n, v, tashdid="\u{651}") {
		for (let i = 0; i < str.length-2; i++) {
			if(str[i] == str[i+1] && is_(str[i], n) &&
			   is_(str[i-1], v) && is_(str[i+2], v))
				str = str_replace_pos(
					str[i]+str[i], str[i]+tashdid, str, i);
		}
		return str;
	}
	/* Beginning 'Hemze' */
	function determine_hemze (s) {
		if(s.startsWith("ئ"))
			return determine_hemze(str_replace_pos("ئ", "ا", s, 0));
		else if(s.startsWith("اا"))
			return str_replace_pos("اا", "آ", s, 0);
		return s;
	}
	return replace_sure(add_tashdid(determine_hemze(ar2IL(s)), n, v), sure);
}

function standardizing (str) {
	return replace_sure(str, [
		["ـ",""],
		["‌+","‌"],
		["ھ","ه"],
		["ه‌","ە"],
		["ك|ﮐ|ڪ","ک"],
		["ﯿ|ﯽ|ﯼ|ي|ى|ے","ی"],
		["ﻦ|ﻥ|ﻧ","ن"],
		["ﺪ|ﺩ","د"],
		["ﻡ|ﻤ|ﻢ|ﻣ","م"],
		["ﺍ|ﺎ","ا"],
		["ﻭ","و"],
		["ﺭ|ﺮ","ر"],
		["ﺯ","ز"],
		["ﮊ","ژ"],
		["ﮔ|ﮓ","گ"],
		["ﺑ","ب"],
		["ﭘ","پ"],
		["ﺖ|ﺗ","ت"],
		["ﺟ","ج"],
		["ﭼ","چ"],
		["ﻗ","ق"],
		["ﺋ","ئ"],
		["ﺱ|ﺳ","س"],
		["ﺸ|ﺷ","ش"]]);
}

function add_bizroke (str, n, v, bizroke="") {
	/* I don't know the exact specification for this procedure. */
	function is_n (ch) { return is_(ch, n) }
	const L1 = L(str, 0);
	const L2 = L(str, 1);
	if(is_n(L1) && (!L2 || is_n(L2)))
		str = str_replace_pos("", bizroke, str, 1);
	return str;
}

function replace_sure (str, sure, f=0, t=1) {
	for(const o of sure)
		str = str.replace(new RegExp(o[f],"g"), o[t]);
	return str;
}

function replace_notsure (str, notsure, determine_fun, i=0) {
	let R;
	while(false !== (R = assoc_first(str, notsure, i))) {
		const j = determine_fun(R, str);
		str = str_replace_pos(R[1][i], R[1][j], str, R[0]);
	}
	return str;
}

function assoc_first (str, arr, i=0, off=0) {
	const str_len = str.length;
	for(let j = off; j < str_len; j++)
		for(const o of arr)
			if(o[i] == str.substr(j, o[i].length))
				return [j, o];
	return false;
}

function L (str, pos, len=1) {
	return str.substr(pos, len);
}

function is_ (c, x) {
	if(c && x.indexOf(c) !== -1) return true;
	return false;
}

function str_replace_pos (from, to, str, pos) {
	return str.substr(0, pos) + to +
		str.substr(pos + from.length);
}

function apply_to_words (str, fun) {
	let include = "«»`1234567890-=~!@#$%^&*()_+[]{}\\|;:'\",./<>?؛،؟١٢٣٤٥٦٧٨٩٠ \n\t\rABCDEFGHIJKLMNOPQRSTUVWXYZ",
	    i = 0, new_str = '';
	while(str[i] !== undefined) {
		let token = '';
		while(str[i] !== undefined &&
		      include.indexOf(str[i].toUpperCase()) === -1)
			token += str[i++];
		if(!token)
			while(str[i] !== undefined &&
			      include.indexOf(str[i].toUpperCase()) !== -1)
				token += str[i++];
		new_str += fun(token);
	}
	return new_str;
}

function apply_to_text (el, proc) {
	let html = '';
	for(const o of el.childNodes) {
		if(o.nodeName == '#text') {
			if(o.parentElement.className.
			   indexOf('material-icons') === -1)
				html += proc(o.data);
			else
				html += o.data;
		}
		else {
			apply_to_text(o, proc);
			if(o.outerHTML !== undefined)
				html += o.outerHTML;
		}
	}
	el.innerHTML = html;
}
