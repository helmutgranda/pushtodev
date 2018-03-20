// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Push To Dev" is now active!');

    // create a new word counter
    let wordCounter = new WordCounter();

    let disposable2 = commands.registerCommand('extension.pushToDev', () => {
        wordCounter.updateWordCount();
    })

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(disposable2);
}

class WordCounter {

    private _statusBarItem: StatusBarItem;

    public updateWordCount() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        if (doc.uri.path.includes("IT/main/code/apps/web/static_web/deployment/www_cluster")) {
            this._statusBarItem.show();
            let filePadding = doc.uri.path.includes("/www_cluster_dev/") ? 16 : 12;
            let localPath = doc.uri.path.substring(doc.uri.path.indexOf('/www_cluster')+filePadding,doc.uri.path.length);

            fs.createReadStream(doc.uri.path).pipe(fs.createWriteStream('/Volumes/Dev_www/'+localPath));
            window.showInformationMessage("Done Uploading " + localPath);
        }else{
            window.showErrorMessage("Nope, you can't copy this file since it is out of the right P4 area");
        }
        
        

        // Only update status if an Markdown file
        // if (doc.languageId === "markdown") {
        //     let wordCount = this._getWordCount(doc);

        //     // Update the status bar
        //     this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
        //     this._statusBarItem.show();
        // } else {
        //     this._statusBarItem.hide();
        // }
    }

    public _getWordCount(doc: TextDocument): number {

        let docContent = doc.getText();

        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}