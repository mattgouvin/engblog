# CLI Examples

Fetch all companies from the last 7 days:
```
engblog list-articles --daysBack 7
```

Fetch specific companies using short flags:
```
engblog list-articles -c google meta netflix
```

Fetch articles within an absolute date range:
```
engblog list-articles --companies stripe anthropic --startDate 2025-01-01 --endDate 2025-03-01
```

Filter for AI/ML content only:
```
engblog list-articles --companies google meta --daysBack 30 --include ai
```

Exclude AI/ML content:
```
engblog list-articles -c netflix spotify -d 14 --exclude ai
```

Show available options:
```
engblog list-articles --help
```
