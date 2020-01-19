import { setBotLimit } from "./actions";

export default function createBotMiddleware() {
  let limitLoaded = false;
  return ({ dispatch }) => {
    return next => action => {
      if (!limitLoaded) {
        limitLoaded = true;
        dispatch(
          setBotLimit(
            localStorage.getItem("bot.limit") !== "null" &&
              !localStorage.getItem("bot.limit")
              ? Number(localStorage.getItem("bot.limit"))
              : 10
          )
        );
      }
      next(action);
    };
  };
}
