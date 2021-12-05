import type { NextPage } from 'next';
import { Layout } from 'components';
import { FormEvent, useState } from 'react';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const unexpectedEmailError = 'Unexpected error.';

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 201) {
        setEmail('');
        setEmailError('');
      } else {
        setEmailError(message || unexpectedEmailError);
      }
    } catch {
      setEmailError(unexpectedEmailError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl">Join the waitlist!</h1>
        <input
          type="email"
          name="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="Your email"
          required
          autoFocus
          className="outline-secondary rounded mt-2"
        />
        <button type="submit" className="bg-primary p-2 text-white outline-secondary rounded ml-1">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default Home;
