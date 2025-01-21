export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  
  const err = error as { code?: string; message?: string };
  
  switch (err?.code) {
    // Supabaseの認証エラーコード
    case "23505":
      return "このメールアドレスは既に登録されています";
    case "23514":
      return "入力値が無効です";
    case "42501":
      return "アクセス権限がありません";
    case "InvalidCredentialsError":
      return "メールアドレスまたはパスワードが正しくありません";
    case "UserNotFoundError":
      return "ユーザーが見つかりません";
    case "WeakPasswordError":
      return "パスワードが脆弱です。より強いパスワードを設定してください";
    case "EmailTakenError":
      return "このメールアドレスは既に使用されています";
    default:
      return err?.message || "エラーが発生しました";
  }
} 