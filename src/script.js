const App = () => {
  const themeVar = {
    app: {backgroundColor: '#131313'},
    terminal: {boxShadow: '0 2px 5px #111'},
    window: {backgroundColor: '#111111', color: '#F4F4F4'},
    field: {backgroundColor: '#000000', color: '#00FF00', fontWeight: 'normal'},
    cursor: {animation: '1.02s blink-dark step-end infinite'}
  };
    
  return React.createElement("div", {id: "app", style: themeVar.app}, React.createElement(Terminal, {theme: themeVar}));
};

const Terminal = ({theme}) => {
  const [size] = React.useState(true);
  const [title, setTitle] = React.useState('Command Prompt');
  const handleClose = () => window.location.href = 'https://github.com/Corentin-Lcs';
  
  return React.createElement("div", {id: "terminal", style: size ? {height: '100vh', width: '100vw', maxWidth: '100vw'} : theme.terminal},

  React.createElement("div", {id: "window", style: theme.window},
  React.createElement("button", {className: "btn red", onClick: handleClose}),
  React.createElement("button", {className: "btn yellow", id: "non-functional-yellow-btn"}),
  React.createElement("button", {className: "btn green", id: "non-functional-green-btn"}),
  React.createElement("span", {id: "title", style: {color: theme.window.color}}, title)),
  React.createElement(Field, {theme: theme, setTitle: setTitle}));
};

class Field extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      commandHistory: [],
      commandHistoryIndex: 0,
      fieldHistory: [{text: 'React Portfolio Terminal'}, {text: 'Type HELP to see the full list of commands.', hasBuffer: true}],
      userInput: '',
      isMobile: false
    };

    this.recognizedCommands = [{
      command: 'help',
      purpose: 'Provides help information for React Portfolio Terminal commands.'},
    {
      command: 'date',
      purpose: 'Displays the current date.'},
    {
      command: 'start',
      purpose: 'Launches a specified URL in a new tab or separate window.',
      help: [
      'START <URL>',
      'Launches a specified URL in a new tab or separate window.',
      '',
      'URL......................The website you want to open.']},
    {
      command: 'clear',
      purpose: 'Clears the screen.'},
    {
      command: 'cmd',
      purpose: 'Starts a new instance of the React Portfolio Terminal.'},
    {
      command: 'exit',
      purpose: 'Quits the React Portfolio Terminal and returns to Corentin\'s GitHub page.'},
    {
      command: 'time',
      purpose: 'Displays the current time.'},
    {
      command: 'about',
      isMain: true,
      purpose: 'Displays basic information about Corentin.'},
    {
      command: 'experience',
      isMain: true,
      purpose: 'Displays information about Corentin\'s experience.'},
    {
      command: 'skills',
      isMain: true,
      purpose: 'Displays information about Corentin\'s skills as a developer.'},
    {
      command: 'contact',
      isMain: true,
      purpose: 'Displays contact information for Corentin.'},
    {
      command: 'projects',
      isMain: true,
      purpose: 'Displays information about what projects Corentin has done in the past.'},
    {
      command: 'project',
      isMain: true,
      purpose: 'Launches a specified project in a new tab or separate window.',
      help: [
      'PROJECT <TITLE>',
      'Launches a specified project in a new tab or separate window.',
      '',
      'List of projects currently include :',
      'composers_list',
      'qr_code_generator',
      'star_wars_opening_crawl',
      '',
      'TITLE....................The title of the project you want to view.']},
    {
      command: 'title',
      purpose: 'Sets the window title for the React Portfolio Terminal.',
      help: [
      'TITLE <INPUT>',
      'Sets the window title for the React Portfolio Terminal.',
      '',
      'INPUT....................The title you want to use for the React Portfolio Terminal window.']},
    ];

    this.handleTyping = this.handleTyping.bind(this);
    this.handleInputEvaluation = this.handleInputEvaluation.bind(this);
    this.handleInputExecution = this.handleInputExecution.bind(this);
    this.handleContextMenuPaste = this.handleContextMenuPaste.bind(this);
  }

  componentDidMount() {
    if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
      this.setState(state => ({
        isMobile: true,
        fieldHistory: [...state.fieldHistory, {isCommand: true}, {
          text: `Unfortunately due to this application being an 'input-less' environment, mobile is not supported. I'm working on figuring out how to get around this, so please bear with me! In the meantime, come on back if you're ever on a desktop.`,
          isError: true,
          hasBuffer: true
        }]
      }));
      
    } else {
      const userElem = document.querySelector('#field');

      userElem.focus();

      document.querySelector('#non-functional-yellow-btn').addEventListener('click', () => this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {isCommand: true}, {text: '> System : That button doesn\'t do anything, it is purely decorative. The only one that works is the red one.', hasBuffer: true}]})));

      document.querySelector('#non-functional-green-btn').addEventListener('click', () => this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {isCommand: true}, {text: '> System : That button doesn\'t do anything, it is purely decorative. The only one that works is the red one.', hasBuffer: true}]})));  
    }
  }

  componentDidUpdate() {
    const userElem = document.querySelector('#field');
    
    userElem.scrollTop = userElem.scrollHeight;
  }

  handleTyping(e) {
    e.preventDefault();

    const {key, ctrlKey, altKey} = e;
    const forbidden = [
    ...Array.from({length: 12}, (x, y) => `F${y + 1}`),
    'ContextMenu', 'Meta', 'NumLock', 'Shift', 'Control', 'Alt',
    'CapsLock', 'Tab', 'ScrollLock', 'Pause', 'Insert', 'Home',
    'PageUp', 'Delete', 'End', 'PageDown'];

    if (!forbidden.some(s => s === key) && !ctrlKey && !altKey) {
      if (key === 'Backspace') {
        this.setState(state => state.userInput = state.userInput.slice(0, -1));
      
      } else if (key === 'Escape') {
        this.setState({userInput: ''});
      
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        const {commandHistory, commandHistoryIndex} = this.state;
        const upperLimit = commandHistoryIndex >= commandHistory.length;

        if (!upperLimit) {
          this.setState(state => ({
            commandHistoryIndex: state.commandHistoryIndex += 1,
            userInput: state.commandHistory[state.commandHistoryIndex - 1]}));
        }
      
      } else if (key === 'ArrowDown' || key === 'ArrowRight') {
        const {commandHistory, commandHistoryIndex} = this.state;
        const lowerLimit = commandHistoryIndex === 0;

        if (!lowerLimit) {
          this.setState(state => ({
            commandHistoryIndex: state.commandHistoryIndex -= 1,
            userInput: state.commandHistory[state.commandHistoryIndex - 1] || '' }));
        }

      } else if (key === 'Enter') {
        const {userInput} = this.state;

        if (userInput.length) {
          this.setState(state => ({
            commandHistory: userInput === '' ? state.commandHistory : [userInput, ...state.commandHistory],
            commandHistoryIndex: 0,
            fieldHistory: [...state.fieldHistory, {text: userInput, isCommand: true}],
            userInput: ''}),
          () => this.handleInputEvaluation(userInput));
        
        } else {
          this.setState(state => ({
            fieldHistory: [...state.fieldHistory, {isCommand: true}]}));
        }
      
      } else {
        this.setState(state => ({
          commandHistoryIndex: 0,
          userInput: state.userInput += key}));
      }
    }
  }

  handleInputEvaluation(input) {
    try {
      const evaluatedForArithmetic = math.evaluate(input);

      if (!isNaN(evaluatedForArithmetic)) {
        return this.setState(state => ({fieldHistory: [...state.fieldHistory, {text: evaluatedForArithmetic}]}));
      }

      throw Error;
    } catch (err) {
      const {recognizedCommands, giveError, handleInputExecution} = this;
      const cleanedInput = input.toLowerCase().trim();
      const dividedInput = cleanedInput.split(' ');
      const parsedCmd = dividedInput[0];
      const parsedParams = dividedInput.slice(1).filter(s => s[0] !== '-');
      const parsedFlags = dividedInput.slice(1).filter(s => s[0] === '-');
      const isError = !recognizedCommands.some(s => s.command === parsedCmd);

      if (isError) {
        return this.setState(state => ({fieldHistory: [...state.fieldHistory, giveError('nr', input)]}));
      }

      return handleInputExecution(parsedCmd, parsedParams, parsedFlags);
    }
  }

  handleInputExecution(cmd, params = [], flags = []) {
    if (cmd === 'help') {
      if (params.length) {
        if (params.length > 1) {
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, this.giveError('bp', {cmd: 'HELP', noAccepted: 1})]}));
        }

        const cmdsWithHelp = this.recognizedCommands.filter(s => s.help);

        if (cmdsWithHelp.filter(s => s.command === params[0]).length) {
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, {
              text: cmdsWithHelp.filter(s => s.command === params[0])[0].help,
              hasBuffer: true}]}));
        
            } else if (this.recognizedCommands.filter(s => s.command === params[0]).length) {
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, {
              text: [
              `No additional help needed for ${this.recognizedCommands.filter(s => s.command === params[0])[0].command.toUpperCase()}`,
              this.recognizedCommands.filter(s => s.command === params[0])[0].purpose],
              hasBuffer: true}]}));
        }

        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, this.giveError('up', params[0].toUpperCase())] }));
      }

      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {
          text: [
          'Main commands:',
          ...this.recognizedCommands.
          sort((a, b) => a.command.localeCompare(b.command)).
          filter(({isMain}) => isMain).
          map(({command, purpose}) => `${command.toUpperCase()}${Array.from({length: 15 - command.length}, x => '.').join('')}${purpose}`),
          '',
          'All commands:',
          ...this.recognizedCommands.
          sort((a, b) => a.command.localeCompare(b.command)).
          map(({command, purpose}) => `${command.toUpperCase()}${Array.from({length: 15 - command.length}, x => '.').join('')}${purpose}`),
          '',
          'For help about a specific command, type HELP <CMD>, e.g. HELP CONTACT.'],
          hasBuffer: true}]}));
    
        } else if (cmd === 'clear') {
      return this.setState({fieldHistory: []});
    
    } else if (cmd === 'start') {
      if (params.length === 1) {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, {text: `Launching ${params[0]}...`, hasBuffer: true}]}),
        () => window.open(/http/i.test(params[0]) ? params[0] : `https://${params[0]}`));
      }

      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, this.giveError('bp', {cmd: 'START', noAccepted: 1})]}));

    } else if (cmd === 'date') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: `The current date is : ${new Date(Date.now()).toLocaleDateString()}`, hasBuffer: true}]}));

    } else if (cmd === 'cmd') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: 'Launching new instance of the React Portfolio Terminal...', hasBuffer: true}]}),
      () => window.open('../React%20Terminal/index.html'));
    
    } else if (cmd === 'exit') {
      return window.location.href = 'https://github.com/Corentin-Lcs';

    } else if (cmd === 'time') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: `The current time is : ${new Date(Date.now()).toLocaleTimeString()}`, hasBuffer: true}]}));

    } else if (cmd === 'about') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: [
          'Hey there !',
          `\n`,
          `My name is Corentin, X years old, I have been passionate about everything related to computers since I was little.`, 
          `\n`,
          `If you need to reach out, feel free to type CONTACT. Otherwise, enjoy exploring the app and make the most of its features !`],
          hasBuffer: true}]}));

    } else if (cmd === 'experience') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: [
          'XXX......................XXXX-XXXX',
          'XXX...................................XXXX-XXXX',
          'XXX...............XXXX-XXXX',
          'XXX.............................XXXX-XXXX',
          'XXX.......XXXX-XXXX'],
          hasBuffer: true}]}));

    } else if (cmd === 'skills') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: [
          `\n`,
          'Languages :',
          'HTML',
          'CSS',
          'JavaScript',
          'C',
          'C#',
          'C++',
          'Python',
          'Latex',
          'Java',
          'Dart',
          'Php',
          'SQLite',
          '',
          'Tools :',
          `Visual Studio Code`,
          `Visual Studio`,
          `JetBrains`,
          `PhpMyAdmin`,
          `Arduino`,
          `Firebase`,
          `Bootstrap`,
          `AndroidStudio`,
          `Flutter`,
          `Unity`,
          `WordPress`,
          'Node',
          'React',
          'jQuery',],
          hasBuffer: true}]}));

    } else if (cmd === 'contact') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: [
          'GitHub: @Corentin-Lcs'
        ],
        
        hasBuffer: true}]}));

    } else if (cmd === 'projects') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {text: [
          'To view any of these projects live or their source files, type PROJECT <TITLE>, e.g. PROJECT composers_list.',
          '',
          '> Composers List',
          'Built with Python.',
          `A dictionary of more than 4 000 composers and a program allowing efficient research of information.`,
          '',
          '> QR Code Generator',
          'Built with Python.',
          'An efficient and usable qr code generator for any information.',
          '',
          '> Star Wars Opening Crawl',
          'Built with HTML, CSS.',
          `A recreation of the opening crawl introductions from the Star Wars films.`],
          hasBuffer: true}]}));

    } else if (cmd === 'project') {
      if (params.length === 1) {
        const projects = [{
          title: 'composers_list',
          live: 'https://github.com/Corentin-Lcs/composers-list' },
        {
          title: 'qr_code_generator',
          live: 'https://github.com/Corentin-Lcs/qr-code-generator' },
        {
          title: 'star_wars_opening_crawl',
          live: 'https://github.com/Corentin-Lcs/star-wars-opening-crawl'}];

        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, {text: `Launching ${params[0]}...`, hasBuffer: true}]}),
        () => window.open(projects.filter(s => s.title === params[0])[0].live));
      }

      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, this.giveError('bp', {cmd: 'PROJECT', noAccepted: 1})]}));

    } else if (cmd === 'title') {
      return this.setState(state => ({
        fieldHistory: [...state.fieldHistory, {
          text: `Set the React Portfolio Terminal title to ${params.length > 0 ? params.join(' ') : '<BLANK>'}`,
          hasBuffer: true}]}),

      () => this.props.setTitle(params.length > 0 ? params.join(' ') : ''));
    
    } 
  }

  handleContextMenuPaste(e) {
    e.preventDefault();

    if ('clipboard' in navigator) {
      navigator.clipboard.readText().then(clipboard => this.setState(state => ({
        userInput: `${state.userInput}${clipboard}`})));
    }
  }

  giveError(type, extra) {
    const err = {text: '', isError: true, hasBuffer: true};

    if (type === 'nr') {
      err.text = `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`;
    
    } else if (type === 'nf') {
      err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`;
    
    } else if (type === 'bf') {
      err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`;
    
    } else if (type === 'bp') {
      err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameter(s) to use, type HELP ${extra.cmd}.`;
    
    } else if (type === 'up') {
      err.text = `The command ${extra} is not supported by the HELP utility.`;
    }

    return err;
  }

  render() {
    const {theme} = this.props;
    const {fieldHistory, userInput} = this.state;

    return React.createElement("div", {
      id: "field",
      className: theme.app.backgroundColor === '#333444' ? 'dark' : '',
      style: theme.field,
      onKeyDown: e => this.handleTyping(e),
      tabIndex: 0,
      onContextMenu: e => this.handleContextMenuPaste(e)},

    fieldHistory.map(({text, isCommand, isError, hasBuffer}) => {
      if (Array.isArray(text)) {
        return React.createElement(MultiText, {input: text, isError: isError, hasBuffer: hasBuffer});
      }

      return React.createElement(Text, {input: text, isCommand: isCommand, isError: isError, hasBuffer: hasBuffer});
    }),

    React.createElement(UserText, {input: userInput, theme: theme.cursor}));
  }
}

const Text = ({input, isCommand, isError, hasBuffer}) => React.createElement(React.Fragment, null,
React.createElement("div", null,
isCommand && React.createElement("div", {id: "query"}, "C:\\Users\\Desktop>"),
React.createElement("span", {className: !isCommand && isError ? 'error' : ''}, input)),

hasBuffer && React.createElement("div", null));

const MultiText = ({input, isError, hasBuffer }) => React.createElement(React.Fragment, null,
input.map(s => React.createElement(Text, {input: s, isError: isError})),
hasBuffer && React.createElement("div", null));

const UserText = ({input, theme}) => React.createElement("div", null, 
React.createElement("div", {id: "query"}, "C:\\Users\\Desktop>"), 
React.createElement("span", null, input), 
React.createElement("div", {id: "cursor", style: theme}));

ReactDOM.render(React.createElement(App, null), document.querySelector('#root'));