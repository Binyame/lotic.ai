### Assessments & Reviews

```
{
  patientAssessment(
    where: { completed: false }
  ) {
    assessment {
      id
      name
      area
      prompts {
        id
        order
        title
        content
        durationMs
      }
    }
  }
  review {
    id
    title
    signalQuestions {
      content
      type
    }
  }
}

```

### Ignoring Assessment

```
{
  mutation ignore(
    $targetType: String,
    $targetId: Int
  ) {
    ignore(
      targetType: $targetType
      targetId: $targetId
    )
  }
}
```
