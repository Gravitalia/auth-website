let id = 0;

export const toasts = ref<
  Array<{
    id: number;
    title: string;
    description: string;
    delay: number;
  }>
>([]);

export function toast({
  title,
  description,
  delay = 3000,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  const currentId = id++;
  toasts.value.push({ id: currentId, title, description, delay });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== currentId);
  }, delay);
}
