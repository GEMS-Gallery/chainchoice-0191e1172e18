export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getResults' : IDL.Func([], [IDL.Text], ['query']),
    'vote' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
