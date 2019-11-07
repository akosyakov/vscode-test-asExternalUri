import * as vscode from 'vscode';
import * as http from 'http';

const PORT = 4000;

export function activate(context: vscode.ExtensionContext) {

  startServer(PORT);

  const disposable = vscode.commands.registerCommand('test.asExternalUri', async () => {
      const response = await vscode.window.showInputBox({
        prompt: 'Enter uri to resolve',
        placeHolder: 'http://localhost:4000'
      });

      if (!response) {
        return
      }

      const resolved = vscode.env.asExternalUri(vscode.Uri.parse(response));
      vscode.window.showInformationMessage(`Resolved to: ${resolved} on client and copied to clipboard`);
      vscode.env.clipboard.writeText(resolved.toString());
  });
  context.subscriptions.push(disposable);
}


function startServer(port: number) {
  const server = http.createServer((req, res) => {
    res.end('Hello world!');
  });
  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });
  server.listen(port);
  vscode.window.showInformationMessage(`Started local server on port: ${port}`);
}
