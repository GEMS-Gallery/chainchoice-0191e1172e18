import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, CircularProgress } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface VotingOption {
  option: string;
  votes: number;
}

interface VotingResults {
  logo: VotingOption[];
  naming: VotingOption[];
  grouping: VotingOption[];
}

const App: React.FC = () => {
  const [logo, setLogo] = useState('');
  const [naming, setNaming] = useState('');
  const [grouping, setGrouping] = useState('');
  const [results, setResults] = useState<VotingResults | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      const resultsJson = await backend.getResults();
      setResults(JSON.parse(resultsJson));
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await backend.vote(logo, naming, grouping);
      await fetchResults();
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
    setLoading(false);
  };

  const createChartData = (data: VotingOption[]) => ({
    labels: data.map(item => item.option),
    datasets: [
      {
        data: data.map(item => item.votes),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Voting Website
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Logo</FormLabel>
          <RadioGroup value={logo} onChange={(e) => setLogo(e.target.value)}>
            <FormControlLabel value="Bitcoin with ICP Logo" control={<Radio />} label="Bitcoin with ICP Logo" />
            <FormControlLabel value="Purple cK Bitcoin Logo" control={<Radio />} label="Purple cK Bitcoin Logo" />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Naming</FormLabel>
          <RadioGroup value={naming} onChange={(e) => setNaming(e.target.value)}>
            <FormControlLabel value="ckBitcoin" control={<Radio />} label="ckBitcoin" />
            <FormControlLabel value="Bitcoin (cK)" control={<Radio />} label="Bitcoin (cK)" />
            <FormControlLabel value="Chain Key Bitcoin" control={<Radio />} label="Chain Key Bitcoin" />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Grouping</FormLabel>
          <RadioGroup value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <FormControlLabel value="Assets listed as standalone" control={<Radio />} label="Assets listed as standalone" />
            <FormControlLabel value="ckAssets grouped under their underlying native asset" control={<Radio />} label="ckAssets grouped under their underlying native asset" />
          </RadioGroup>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit Vote'}
        </Button>
      </form>
      {results && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h4" gutterBottom>Results</Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '30%' }}>
              <Typography variant="h6">Logo</Typography>
              <Pie data={createChartData(results.logo)} />
            </div>
            <div style={{ width: '30%' }}>
              <Typography variant="h6">Naming</Typography>
              <Pie data={createChartData(results.naming)} />
            </div>
            <div style={{ width: '30%' }}>
              <Typography variant="h6">Grouping</Typography>
              <Pie data={createChartData(results.grouping)} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default App;
