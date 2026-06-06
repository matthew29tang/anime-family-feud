const styles = theme => ({
  card: {
    minWidth: 275,
    marginBottom: 20,
    padding: 18,
  },
  title: {
    fontSize: 14,
  },
  header: {
    fontSize: 18,
  },
  paper: {
    padding: theme.spacing(3, 2),
  },
  body: {
    textAlign: "left",
    wordWrap: "break-word",
    paddingLeft: '15px'
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
  },
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 10,
    paddingRight: 10,
    width: "20%"
  },
  nextButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: "8%"
  },
});

export default styles;