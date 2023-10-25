import app from './app';

app.listen(Bun.env.PORT || 3000, () => {
  console.log(`running on port http://localhost:${Bun.env.PORT}`);
});
