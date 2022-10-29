export const consoleFormatting = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	underlined: '\x1b[4m',

	//text color

	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',

	white: '\x1b[97m',
	lightGray: '\x1b[37m',
	darkGray: '\x1b[90m',

	//background color

	blackBg: '\x1b[40m',
	darkGrayBg: `\x1b[48;5;233m`,
	redBg: '\x1b[41m',
	greenBg: '\x1b[42m',
	yellowBg: '\x1b[43m',
	blueBg: '\x1b[44m',
	magentaBg: '\x1b[45m',
	cyanBg: '\x1b[46m',
	whiteBg: '\x1b[47m',
};
const cf = consoleFormatting;

const o = cf.reset + cf.lightGray; // outline
const c = cf.reset + cf.red + cf.bold; // center
const t = cf.reset + cf.white + cf.bold; //cf.red // text

export const asciiArt = `${o}

       /¯¯¯¯¯¯¯¯¯¯\\
      /            \\
  \\¯¯/    /¯¯¯¯\\_--¯
   \\/____/  ${c}▄▄            ${t} __  ___ __   ___    ___${c}  
            ▀▀${o}  /¯¯¯¯/\\   ${t}|__)|__ |  \\ |__ \\ /|__${o}  
      _--¯\\____/    /__\\  ${t}|  \\|___|__/ |___ | |___${o}  
      \\            /
       \\__________/
${cf.reset}`;
