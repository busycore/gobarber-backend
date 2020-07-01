interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: { from: { email: string; name: string } };
}
export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'Não Responda - Equipe Busycore',
      email: 'no-reply@busycore.com.br',
    },
  },
} as IMailConfig;
