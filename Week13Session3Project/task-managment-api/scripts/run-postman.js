const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const newman = require('newman');

const projectRoot = path.resolve(__dirname, '..');
const collectionPath = path.join(projectRoot, 'TaskManagementAPI.postman_collection.json');

// Poll the local port until the server starts listening so the Postman suite only
// runs against a healthy API instance.
function waitForServer(port, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function check() {
      const socket = net.createConnection({ port, host: '127.0.0.1' });

      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });

      socket.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          socket.destroy();
          reject(new Error(`Server did not start on port ${port} in time.`));
          return;
        }
        setTimeout(check, 500);
      });
    }

    check();
  });
}

function stopServer(child) {
  if (!child || child.exitCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    child.once('exit', () => resolve());
    child.kill('SIGTERM');
    setTimeout(() => {
      if (child.exitCode === null) {
        child.kill('SIGKILL');
      }
      resolve();
    }, 2000);
  });
}

async function main() {
  const server = spawn(process.execPath, ['server.js'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  try {
    await waitForServer(3001);

    const collection = require(collectionPath);

    await new Promise((resolve, reject) => {
      newman.run({
        collection,
        reporters: ['cli']
      }, (err, summary) => {
        if (err) {
          reject(err);
          return;
        }

        const failed = summary.run.failures.length;
        if (failed > 0) {
          reject(new Error(`Postman collection failed with ${failed} failing request(s).`));
          return;
        }

        resolve(summary);
      });
    });

    console.log('\nPostman collection passed successfully.');
  } catch (error) {
    console.error('\nPostman test run failed:');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await stopServer(server);
  }
}

main();
