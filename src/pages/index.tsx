import { useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { Layout } from 'src/components';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [_emailError, setEmailError] = useState('');
  const [_loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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
          onChange={({ target }): void => setEmail(target.value)}
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
