# 'Blocked process report' report

Analyses a SQL Server "Blocked process report" trace and summarises all blocking / blocked queries.
The trace must be saved as XML (*File > Save As ... > Select .xml as output*)

Install globally (`npm i -g bprr`) and run:

```bash
bprr /path/to/trace.xml [<encoding>]
```

SQL Server Profiler tends to save it's output in **UTF-16**, though node supports **UCS-2** and so you'll usually be running:

```bash
bprr /path/to/trace/xml ucs2
```
