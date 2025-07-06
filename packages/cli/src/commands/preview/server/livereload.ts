import { Server } from "http";
import { cwd } from "process";
import { relative } from "path";
import { watch } from "chokidar";
import { Server as SocketServer, Socket } from "socket.io";

import { error, log, debug } from "../../../util/serverLogger";
import { linkEmailsDirectory } from "./setup";

export const WATCH_IGNORE = /^\.|node_modules/;

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options?: { leading?: boolean }
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastArgs: Parameters<T>;
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (options?.leading && !timeoutId) {
      func(...args);
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (!options?.leading) {
        func(...lastArgs);
      }
    }, delay);
  };
}

export function startChangeWatcher(server: Server, emailsDir: string) {
  try {
    // simple live reload implementation
    const changeWatchPath = emailsDir;
    if (!changeWatchPath) {
      log("error finding emails dir in . or ./src");
      return;
    }

    let clients: Socket[] = [];
    const io = new SocketServer(server);

    io.on("connection", (client) => {
      clients.push(client);

      client.on("disconnect", () => {
        clients = clients.filter((item) => item !== client);
      });
    });

    const reload = debounce(
      async () => {
        debug("reload from change");
        await linkEmailsDirectory(emailsDir);

        await new Promise((resolve) => setTimeout(resolve, 150));
        clients.forEach((client) => {
          client.emit("reload");
        });
      },
      100,
      { leading: true }
    );

    watch(changeWatchPath, { ignoreInitial: true }).on(
      "all",
      (eventType, filename) => {
        if (WATCH_IGNORE.test(filename)) return;
        log(`detected ${eventType} on ${filename}, reloading`);
        // Note: require.cache is not available in ESM, hot reloading handled differently
        void reload();
      }
    );

    log(`watching for changes to ${relative(cwd(), changeWatchPath)}`);
  } catch (e) {
    error(`error starting livereload change watcher`, e);
  }
}
