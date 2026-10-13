import type { NotificationContext } from "@fast-crud/ui-interface";

type AntdvNotificationContext = {
  type?: string;
  message?: string;
  text?: string;
  title?: string;
  description?: string;
};

export function normalizeNotificationContext(notificationContext: NotificationContext | string): Record<string, any> {
  if (typeof notificationContext === "string") {
    return { title: notificationContext };
  }

  const { message, text, title, description, ...rest } = notificationContext as Exclude<NotificationContext, string> & {
    description?: string;
  };

  return {
    ...rest,
    ...(title != null ? { title } : message != null ? { title: message } : {}),
    ...(description != null ? { description } : text != null ? { description: text } : {})
  };
}
