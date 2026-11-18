using DocumentApi.Models;

namespace DocumentApi.Data;

public sealed class DocumentRepository : IDocumentRepository
{
    private static readonly IReadOnlyList<Document> Documents =
    [
        new()
        {
            Id = 1,
            Name = "Quarterly Financial Report - Q3 2026",
            Description = "Revenue, expense, and forecast summaries for the third quarter.",
            Category = "Finance",
            FileType = "PDF",
            LastModified = new DateTime(2026, 10, 15)
        },
        new()
        {
            Id = 2,
            Name = "Annual Budget Planning Guide",
            Description = "Planning calendar, department templates, and budget submission guidance.",
            Category = "Finance",
            FileType = "XLSX",
            LastModified = new DateTime(2026, 9, 28)
        },
        new()
        {
            Id = 3,
            Name = "Employee Benefits Handbook",
            Description = "An overview of health, retirement, and leave benefits for employees.",
            Category = "Human Resources",
            FileType = "PDF",
            LastModified = new DateTime(2026, 8, 12)
        },
        new()
        {
            Id = 4,
            Name = "New Hire Onboarding Checklist",
            Description = "A practical checklist for managers welcoming a new team member.",
            Category = "Human Resources",
            FileType = "DOCX",
            LastModified = new DateTime(2026, 7, 30)
        },
        new()
        {
            Id = 5,
            Name = "Office Safety and Emergency Procedures",
            Description = "Site contacts, evacuation routes, and emergency response steps.",
            Category = "Operations",
            FileType = "PDF",
            LastModified = new DateTime(2026, 10, 2)
        },
        new()
        {
            Id = 6,
            Name = "IT Equipment Request Process",
            Description = "How to request, receive, and return company technology equipment.",
            Category = "Technology",
            FileType = "DOCX",
            LastModified = new DateTime(2026, 6, 19)
        },
        new()
        {
            Id = 7,
            Name = "Information Security Standards",
            Description = "Baseline requirements for protecting company accounts and information.",
            Category = "Technology",
            FileType = "PDF",
            LastModified = new DateTime(2026, 10, 21)
        },
        new()
        {
            Id = 8,
            Name = "Vendor Agreement Review Checklist",
            Description = "Key legal and compliance considerations for vendor agreements.",
            Category = "Legal",
            FileType = "DOCX",
            LastModified = new DateTime(2026, 5, 7)
        },
        new()
        {
            Id = 9,
            Name = "Records Retention Policy",
            Description = "Retention schedules and disposal guidance for business records.",
            Category = "Legal",
            FileType = "PDF",
            LastModified = new DateTime(2026, 4, 25)
        }
    ];

    public IReadOnlyList<Document> GetAll() => Documents;

    public Document? GetById(int id) => Documents.FirstOrDefault(document => document.Id == id);

    public IReadOnlyList<string> GetCategories() =>
        Documents.Select(document => document.Category)
            .Distinct(StringComparer.Ordinal)
            .Order(StringComparer.Ordinal)
            .ToArray();
}
