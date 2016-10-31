# 'Blocked process report' report

Analyses a SQL Server "Blocked process report" trace and summarises all blocking / blocked queries.
The trace must be saved as XML (*File > Save As ... > Select .xml as output*)

Install globally (`npm i -g bprr`) and run:

```bash
bprr /path/to/trace.xml [<encoding>]
```

The `<encoding>` argument is optional, and defaults to `ucs2` (**UCS-2** is a subset of **UTF-16** which is the encoding that SQL Server Profile saves in).

After running `bprr` you'll see a report printed to stdout. There will be 3 sections:

- all queries
- blocking queries
- blocked queries

Each section will indicate how many unique queries were encountered and will then give a summary report for each unique query in the following format:

```
# executions:  <# of times this query was executed / appeared in the trace>
          <the query itself>
```
