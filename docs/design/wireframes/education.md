# Wireframe: Education

## Education section

```text
Education                                           [ + Add ]

┌──────────────────────────────────────────────────────────┐
│ Coastal University                            [Edit] [⋮] │
│ Computer Science · Bachelor of Science                   │
│ Completed · 2016–2020                                    │
└──────────────────────────────────────────────────────────┘
```

## Add/edit dialog

```text
Add education                                            [×]

Institution *
[ Search institutions...___________________________ ]
  results + Create custom institution

-- hidden until Institution selected --
Major / Specialization *
[ Search programs at Coastal University..._________ ]
  institution offerings + Create custom

-- hidden until Major / Specialization selected --
Degree Type *
[ Search degree types...___________________________ ]
  known program degree types + fallback/custom

Status
[ Select...                                      v]

Start year                 End year
[ Year v ]                 [ Year v ]

[ ] I currently study here

                                      [Cancel] [Save]
```

Parent changes clear incompatible descendants.
