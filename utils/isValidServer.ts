export default function (url: string) {
  return new RegExp(
    /^((localhost(:\d{1,5})?)|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ).test(url);
}
