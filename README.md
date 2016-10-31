# 'Blocked process report' report

Analyses a SQL Server "Blocked process report" trace and summarises all blocking / blocked queries.
The trace must be saved as XML (*File > Save As ... > Select .xml as output*)

Install globally (`npm i -g bprr`) and run:

```bash
bprr /path/to/trace.xml [<encoding>]
```

The `<encoding>` argument is optional, and defaults to `ucs2` (**UCS-2** is a subset of **UTF-16** which is the encoding that SQL Server Profile saves in).
